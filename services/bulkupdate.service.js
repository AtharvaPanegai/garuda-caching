const logger = require("logat");
const axios = require("axios");

let batchStorage = {}; // Storage for api logs
let batchSize = 0;
const MAX_BATCH_SIZE = 500;
const BATCH_INTERVAL = 60 * 1000;


const _getApiLog = (message) => {
    let apiLog = {
        projectId: message.projectId,
        path: message.path,
        method: message.method,
        timestamp: new Date()
    }
    return apiLog;
}

const sendBatchData = async () => {
    if (batchSize === 0) {
        logger.info(`INFO || Batch is empty, returning`);
        return;
    }

    logger.info(`INFO || Processing Batch data before sending to database`);

    const bulkUpdateData = {
        bulkData : batchStorage
    }
    batchStorage = {};
    batchSize = 0;

    try {
        const response = await axios.post(`${process.env.GARUDA_API}/radar/bulkupdate`, bulkUpdateData);
        logger.info(`INFO || Batch data sent successfully to Garuda API`);
    } catch (err) {
        logger.error(`Error || Error in sending batch data to Garuda API`);
        logger.error(err);
        throw err;
    }
};

setInterval(sendBatchData, BATCH_INTERVAL);

const batchConsumer = async (message) => {
    try {
        logger.info(`INFO || API Log reached batch consumer at : ${new Date()}`);

        let apiLog = _getApiLog(message);
        const key = `${apiLog.projectId}${apiLog.path}`;

        // if (!batchStorage[key]) {
        //     // Initialize the entry if it doesn't exist
            // batchStorage[key] = [{
            //     projectId: apiLog.projectId,
            //     path: apiLog.path,
            //     method: apiLog.method,
            //     hits: 1,
            //     timestamp: new Date()
            // }];
        // } else {
        //     // Update existing entry
        //     batchStorage[key].hits += 1;
        //     batchStorage[key].push(apiLog);
        // }

        if(!batchStorage[key]){
            // Initilize the entry if it doesn't exist
            batchStorage[key] = {
                hits:1,
                apiLogs : []
            }
            batchStorage[key].apiLogs.push(apiLog);
        }else{
            // Update existing entry
            batchStorage[key].hits += 1;
            batchStorage[key].apiLogs.push(apiLog);
        }
      
        batchSize++;

        logger.info(`INFO || Current batch size: ${batchSize}`);

        if (batchSize >= MAX_BATCH_SIZE) {
            await sendBatchData();
        }
    } catch (err) {
        logger.error(`Error || Error processing message in batch consumer`);
        logger.error(err);
        throw err;
    }
};

module.exports.batchConsumer = batchConsumer;


        // batch storage is the complete object which has to be sent to main backend
        // let bulkData = {
        //     "completeApiPath":{
        //         hits : 100,
        //         apiLogs : [
        //             {
        //                 "method": "POST",
        //                 "path": "/api/test/radar",
        //                 "statusCode": 500,
        //                 "responseTime": "500.686 ms",
        //                 "projectId": "66e58d8772f1407f8cd6012c",
        //                 "timestamp": "2025-03-06T18:05:05.882Z"
        //             },
        //             .
        //             .
        //             .
        //         ]
        //     }
        // }
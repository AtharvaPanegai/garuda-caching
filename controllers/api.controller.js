const axios = require("axios");
const { batchConsumer } = require("../services/bulkupdate.service");
const { _isApiDown } = require("../utils/api.utils");
const BigPromise = require("../utils/BigPromise");
const { publishToQueue } = require("../utils/rabbitmq.utils");
const logger = require("logat");


exports.Monitorapi = BigPromise(async(req,res,next)=>{
    const apiLogInfo = req.body;
    if(_isApiDown(apiLogInfo.statusCode)){
        logger.error(`Error || API is down for the given apiLog Info sending it to garuda-api`);
        try{
            let options = {
                method: 'POST',
                url: `${process.env.GARUDA_API}/radar/monitorapi`, 
                headers: req.headers,
                data : req.body,
            };
            let resp = await axios(options)
            logger.info(`INFO || Response from garuda-api : ${resp.data}`);
        }catch(err){
            logger.error(`Error || Error in sending apiLogInfo to garuda-api`);
            logger.error(err);
            throw err;
        }
    }
    await publishToQueue("garuda.monitorapi",apiLogInfo,batchConsumer);
    logger.info(`INFO || Messgae published to RabbitMQ with actionName : garuda.monitorapi`);
    return res.status(200).json({
        statusCode: 200,
        message: "Hit Recorded!"
    })
})



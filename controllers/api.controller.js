const { batchConsumer } = require("../services/bulkupdate.service");
const BigPromise = require("../utils/BigPromise");
const { publishToQueue } = require("../utils/rabbitmq.utils");
const logger = require("logat");


exports.Monitorapi = BigPromise(async(req,res,next)=>{
    const apiLogInfo = req.body;
    await publishToQueue("garuda.monitorapi",apiLogInfo,batchConsumer);
    logger.info(`INFO || Messgae published to RabbitMQ with actionName : garuda.monitorapi`);
    return res.status(200).json({
        statusCode: 200,
        message: "Hit Recorded!"
    })
})



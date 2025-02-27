const BigPromise = require("../utils/BigPromise");
const { publishToQueue } = require("../utils/rabbitmq.utils");
const logger = require("logat");


exports.Monitorapi = BigPromise(async(req,res,next)=>{
    const apiLogInfo = req.body;
    await publishToQueue("garuda.monitorapi",apiLogInfo)
    return res.status(200).json({
        statusCode: 200,
        message: "Hit Recorded!"
    })
})


exports.configureApiMonitoring = BigPromise(async(req,res,next)=>{
    try{
    logger.info(`INFO || Conifguring api monitoring in cache for api : ${req.body.apiId}`)
    }catch(err){
        console.log(err);
    }
})
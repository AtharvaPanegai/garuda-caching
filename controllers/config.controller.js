const logger = require("logat");
const BigPromise = require("../utils/BigPromise");
const { setRedisKeyValue } = require("../services/redis.service");

exports.configureApiMonitoring = BigPromise(async(req,res,next)=>{
    try{
    logger.info(`INFO || Conifguring api monitoring in cache for api : ${req.body.apiPath}`);
    const {apiPath,projectId,isMonitoring} = req.body;


    if(!apiPath || isMonitoring === undefined){
        logger.error(`Error || Error in configuring api monitoring in cache for api : ${req.body.apiPath}`);
        return res.status(422).json({
            statusCode: 422,
            message: "Missing apiPath or isMonitoring flag"
        });
    }

    const redisKey = `${projectId}${apiPath}`;
    await setRedisKeyValue(redisKey,isMonitoring);

    logger.info(`INFO || Monitoring for the api is set ${isMonitoring} to api : ${apiPath}`);

    return res.status(200).json({
        success : true,
        message : "API Monitoring is set in cache"
    })

    }catch(err){
        logger.error(`Error || Error in configuring api monitoring in cache for api : ${req.body.apiPath}`);
        logger.error(err);
        throw err;   
    }
})
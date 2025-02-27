const redis = require("../config/redis.config");
const logger = require("logat");

const setRedisKeyValue = async (redisKey,value) =>{
    try{
        await redis.set(redisKey,value);
        return true;
    }catch(err){
        logger.error(`Error || Error in setting value in cache for key : ${redisKey}`);
        logger.error(err);
        throw err;
    }
}

module.exports.setRedisKeyValue = setRedisKeyValue;
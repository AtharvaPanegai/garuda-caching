const Redis = require("ioredis"); 
const logger = require("logat")

const redis = new Redis({
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
})

redis.on("connect",()=>{
    logger.info(`INFO || Connected to Redis successfully...`);
})

redis.on("error",(err)=>{
    logger.error(`PANIC || Unable to connect to Redis...`);
    logger.error(err);
})

module.exports = redis;

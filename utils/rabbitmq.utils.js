const logger = require("logat");
const MainQueue = require("../services/rabbitmq.service");

const publishToQueue = async(actionName,message,consumerFun) =>{
    const mainQueue = MainQueue.getInstance(actionName);    

    if(!MainQueue.CONNECTION){
    try{
            logger.info(`INFO || Creating rabitmq connection here`);
            await MainQueue.createConnection();
        }catch(err){
            logger.error(`Error || Error in creating connection with rabbitmq`);
            logger.error(err);
            throw err;
        }
    }

    try{
        logger.info(`INFO || Creating Channel with actionName : ${actionName}`);
        await mainQueue.createChannel(actionName);
        logger.info(`INFO || Channel created successfully with actionName : ${actionName}`); 
    }catch(err){
        logger.error(`Error || Error in creating channel with actionName : ${actionName}`);
        logger.error(err);
        throw err;
    }

    try {
        logger.info(`INFO || Initilzing consumer with actionName : ${actionName}`);
        await mainQueue.initiateConsumer(actionName,consumerFun);
        logger.info(`INFO || Consumer initiated successfully with actionName : ${actionName}`);        
    } catch (error) {
        logger.error(`Error || Error in initiating consumer with actionName : ${actionName}`);
        logger.error(error);
        throw error;  
    }

    try{
        logger.info(`INFO || Adding message to queue with actionName : ${actionName}`);
        await mainQueue.addRequestToQueue(message,actionName);
        logger.info(`INFO || Message added to queue with actionName : ${actionName}`);
    }catch(err){
        logger.error(`Error || Error in adding message to queue with actionName : ${actionName}`);
        logger.error(err);
        throw err;
    }

}

module.exports.publishToQueue = publishToQueue;
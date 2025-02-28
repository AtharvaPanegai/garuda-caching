const logger = require("logat");
const RabbitMqClient = require("../config/rabbitmq.client");

class MainQueue{
    constructor(actionName){
        this.queue = actionName;
        this.consumers = {};
    }

    static async createConnection(){
        MainQueue.CONNECTION = await RabbitMqClient.createConnection();
        return MainQueue.CONNECTION;
    }


    static getInstance(actionName){
        if(!MainQueue.instance){
            MainQueue.instance = new MainQueue(actionName);
        }
        return MainQueue.instance;
    }


    async createChannel(actionName){
        if(this.channel){
            logger.info(`INFO || Channel with actionName : ${actionName} already exists returning`);
            return this.channel;
        }
        if(MainQueue.CONNECTION){
            this.channel = await MainQueue.CONNECTION.createChannel(actionName);
            await this.channel.assertQueue(actionName,{durable : true});
            logger.info(`INFO || Channel with actionName : ${actionName} created successfully`);
            return this.channel;
        }else{
            logger.error(`Error || Unable to connect with RabbitMQ Connection`);
            throw new Error("Connection Not established!, call createConnection first");
        }
    }

    async addRequestToQueue(message,actionName){
        if(!this.channel){
            logger.error(`Error || Attempt to add message into queue before creation of channel, please create channel first`);
            throw new Error(`Channel Does not exists, please create channel first`);
        }
        try{
            let bufferedMessage = Buffer.from(JSON.stringify(message));
            await this.channel.assertQueue(actionName,{durable : true});
            this.channel.sendToQueue(actionName,bufferedMessage,{
                persistant : true,
            })
        }catch(err){
            logger.error(`Error || Error in Adding request to queue : ${actionName}`);
            logger.error(err);
            throw err;
        }
    }

    async initiateConsumer(actionName,queueResponseHandler){
        if(!this.channel){
            logger.error(`Error || Attempt to initiate consumer before creation of channel,Please create chanel first`);
            throw new Error(`Channel not created yet.Please create channel first`);
        }
        
        if(this.consumers[actionName]){
            logger.info(`INFO || Consumer with actionName : ${actionName} already exists returning`);
            return this.consumers[actionName];
        }
        try {
            logger.info(`INFO || Initiating Consumer with actionName : ${actionName}`);
            this.consumers[actionName] = await this.channel.consume(actionName,async (message)=>{
                let queueMessage = JSON.parse(message.content.toString());
                try{
                    logger.info(`INFO || Calling the respective queueResponseHandler for actionName : ${actionName}`);
                    await queueResponseHandler(queueMessage);
                    logger.info(`INFO || Queue Response handler for this actionName : ${actionName} executed successfully`);
                    this.channel.ack(message)
                }catch(err){
                    logger.error(`Error || Error in consuming message from queue : ${actionName} with error : ${err}`);
                    logger.error(err);
                    this.channel.nack(message);
                    throw err;
                }
            });
            return this.consumers[actionName];
        } catch (error) {
            logger.error(`PANIC || Unable to create consumer for this actionName : ${actionName}`);
            logger.error(error);
            throw error;
        }

    }
}

MainQueue.CONNECTION = null;
MainQueue.CHANNEL = null;
MainQueue.instance = null;

module.exports = MainQueue;
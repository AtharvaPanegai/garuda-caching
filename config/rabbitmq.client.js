const logger = require("logat");
const amqp = require("amqplib");

class RabbitMqClient {
    static async createConnection(){
        try{
            let rabbitMqHost = process.env.RABBITMQ_URL;
            if(!RabbitMqClient.CONNECTION){
                const connection = await amqp.connect(rabbitMqHost);
                RabbitMqClient.CONNECTION = connection;
            }
            logger.info(`INFO || RabbitMQ Connection established!`);
            return RabbitMqClient.CONNECTION;
        }catch(err){
            logger.error(`Error || Error in establishing connection with rabbitmq`);
            logger.error(err);
            throw err;
        }
    }
}

RabbitMqClient.CONNECTION = null;

module.exports = RabbitMqClient;
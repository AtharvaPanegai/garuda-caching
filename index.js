const app = require("./app");
const connectDb = require("./config/db.config");
require('dotenv').config();
const logger = require("logat");
const redis = require("./config/redis.config");
const MainQueue = require("./services/rabbitmq.service");

async function startGarudaCaching() {
    try {
        // connecting DB here
        await connectDb();

        // rabbitmq connection
        await MainQueue.createConnection();
        console.log('RabbitMQ is ready');

        // Redis connection
        await redis.ping();
        console.log('Redis is ready');

        app.listen(process.env.PORT, () => {
            logger.info(`INFO || garuda-caching is up and running at PORT ${process.env.PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

startGarudaCaching();

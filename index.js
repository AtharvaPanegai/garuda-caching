const app = require("./app");
const connectDb = require("./config/dbConfig");
require('dotenv').config();
const logger = require("logat")

// connecting DB here
connectDb();

app.listen(process.env.PORT,()=>{
    logger.info(`INFO || garuda-caching is up and running at PORT ${process.env.PORT}`);

})

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({origin : "*"}));
app.use(cookieParser());
app.use(morgan("tiny"));


// home route
app.get("/",(req,res)=>{
    res.status(200).json({
        success : true,
        message : "Garuda Caching says hi"
    })
})


module.exports = app;
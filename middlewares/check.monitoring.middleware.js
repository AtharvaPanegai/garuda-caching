const redis = require("../config/redis.config");

exports.checkMonitoring = async (req, res, next) => {
    let apiObj = req.body;
    const { projectId } = req.body;  // Extract projectId from request headers
    if (!projectId) {
        res.status(422).json({ success: true, message: 'Missing projectId' });
    }
    const apiPath = req.body.path;
    const redisKey = `${projectId}${apiPath}`;

    const monitoringStatus = await redis.get(redisKey);
    // Sending the request further if the monitoring is enabled or it is not present at all in redis
    if (monitoringStatus == 'true') {
        next();
    }
    if(monitoringStatus == null){
        req.isNewAPI = true; // Indicating that this is a new API
        next();
    }
    res.status(201).json({
        message: "monitoring isn't enabled for this api yet",
        path: apiObj?.path,
        method: apiObj?.method,
    })
};

//66e58d8772f1407f8cd6012c/api/test/radar 
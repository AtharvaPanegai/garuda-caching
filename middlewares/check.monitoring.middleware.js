const redis = require("../config/redis.config");

exports.checkMonitoring = async (req, res, next) => {
    let apiObj = req.body;
    const { projectId } = req.body;  // Extract projectId from request headers
    if (!projectId) {
        return res.status(422).json({ success : true,message: 'Missing projectId' });
    }

    const apiPath = req.body.path;
    const redisKey = `${projectId}${apiPath}`; 

    const monitoringStatus = await redis.get(redisKey);
    console.log(monitoringStatus)
    if (monitoringStatus !== 'true') {
        res.status(201).json({
            message: "monitoring isn't enabled for this api yet",
            path: apiObj?.path,
            method: apiObj?.method,
        })
        return;
    }
    next();
};

//66e58d8772f1407f8cd6012c/api/test/radar 
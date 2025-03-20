
exports._isApiDown = (statusCode) => {
    if (!statusCode || typeof statusCode !== "number") {
        throw new Error("Invalid status code");
    }
    return statusCode >= 500 || statusCode === 429;
};
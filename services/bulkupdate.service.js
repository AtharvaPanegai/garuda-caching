
const bulkUpdates = {};
export const processQueue = async () => {
    channel.consume('api_hits', (msg) => {
        const { apiPath } = JSON.parse(msg.content.toString());
        bulkUpdates[apiPath] = (bulkUpdates[apiPath] || 0) + 1;
        channel.ack(msg);
    });
    setInterval(async () => {
        if (Object.keys(bulkUpdates).length > 0) {
            await updateDatabase(bulkUpdates);
            Object.keys(bulkUpdates).forEach(key => delete bulkUpdates[key]);
        }
    }, 60000);
};
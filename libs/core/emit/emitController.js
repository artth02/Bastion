var emitService = require('./emitService.js');

module.exports = {
    sendNotification: sendNotification
};

function sendNotification(req, res, next) {
    emitService.emit(req.body);
    res.status(200).end();
}
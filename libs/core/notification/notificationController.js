var notificationService = require('./notificationService.js');

module.exports = {
    sendNotification: sendNotification
};

function sendNotification(req, res, next) {
    notificationService.emit(req.body);
    res.status(200).end();
}
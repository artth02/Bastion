var notificationService = require('./notificationService.js'),
    notificationSchemas = require('./notificationSchemas.js');

module.exports = {
    sendNotification: sendNotification
};

function sendNotification(req, res, next) {
    notificationSchemas.apiSchemas.sendNotification.validate(req.body, notificationSchemas.apiSchemas.sendNotification.body, function(err, value) {
        if (err)
            next(err);
        else {
            notificationService.emit(req.body);
            res.status(200).end();
        }
    });

}
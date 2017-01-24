var notificationController = require('./../../core/notification/notificationController.js');

module.exports = function(app) {
    app.route('/bastion/api/notification')
        .post(notificationController.sendNotification);
}
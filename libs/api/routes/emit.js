const emitController = require('./../../core/emit/emitController.js');

module.exports = function (app) {
    app.route('/bastion/api/v1/emit')
        .post(emitController.sendNotification);
}
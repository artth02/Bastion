const inspectController = require('./../../core/inspect/inspectController.js');

module.exports = function (app) {
    app.route('/bastion/api/notification/inspect/channels')
        .get(inspectController.inspect);

    app.route('/bastion/api/notification/inspect/channels/:channelName')
        .get(inspectController.inspectChannel);
}
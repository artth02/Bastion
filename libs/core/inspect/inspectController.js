var notificationService = require('./../notification/notificationService.js');

module.exports = {
    inspect: inspect,
    inspectChannel: inspectChannel
};

function inspect(req, res, next) {
    notificationService.inspect(function (data) {
        res.status(200).json(data);
    });
}

function inspectChannel(req, res, next) {
    notificationService.inspectChannel(req.params.channelName, function (data) {
        res.status(200).json(data);
    });
}
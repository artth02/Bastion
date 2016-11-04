var express = require('express'),
    app = express(),
    http = require('http'),
    cluster = require('cluster'),
    config = require('./config/environment.js'),
    cpuCount = config.clusters;

if (cluster.isMaster && cpuCount > 0) {
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });
}
else {
    (function loadEventEmitter() {
        const EventEmitter = require('events');
        class EventClass extends EventEmitter { };
        const eventClass = new EventClass();
        global.eventClass = eventClass;
    })();

    (function loadJsonBodyParser() {
        var bodyParser = require('body-parser');
        app.use(bodyParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());
    })();

    (function loadSecurityMiddleware() {
        app.use(require('./libs/api/middlewares/cors.js'));
        // app.use(require('./libs/api/middleware/token.js'));
    })();

    (function loadModelViewControllers() {
        require('./libs/api/routes/healthCheck.js')(app);
        require('./libs/api/routes/emit.js')(app);

        app.get('/index', function (req, res) {
            res.sendFile(__dirname + '/libs/test/index.html');
        });

        app.get('/cde', function (req, res) {
            res.sendFile(__dirname + '/libs/test/index.cde.html');
        });

        app.get('/cobner', function (req, res) {
            res.sendFile(__dirname + '/libs/test/index.cobner.html');
        });
    })();

    (function loadAftermathMiddleware() {
        app.use(require('./libs/api/middlewares/notFound.js'));
        app.use(require('./libs/api/middlewares/error.js'));
    })();

    (function loadSocketIO() {
        global.socketIO = require('socket.io')(config.io.port);
        require('./libs/core/emit/emitService.js').Init();
        console.log('Port: ' + config.io.port + ' - Socket.IO');
    })();

    var httpServer = http.createServer(app);

    httpServer.listen(config.port, function () {
        console.log('Port: ' + config.port + ' - Express server');
    });
}
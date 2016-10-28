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

        app.get('/', function (req, res) {
            res.sendFile(__dirname + '/libs/test/index.html');
        });
    })();

    (function loadAftermathMiddleware() {
        app.use(require('./libs/api/middlewares/notFound.js'));
        app.use(require('./libs/api/middlewares/error.js'));
    })();


    var httpServer = http.createServer(app);
    var io = require('socket.io')(httpServer);

    (function loadSocketIO() {
        io.on('connection', function (socket) {

            console.log('a user connected');

            socket.on('chat message', function (msg) {
                io.emit('chat message', msg);
            });

            socket.on('disconnect', function () {
                console.log('user disconnected');
            });

        });
    });

    httpServer.listen(config.port, function () {
        console.log('Express server listening on port ' + config.port);
    });
}
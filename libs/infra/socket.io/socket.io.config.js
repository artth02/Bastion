module.exports = function (httpServer) {
    var io = require('socket.io')(10008);

    //Nomes dos canais
    var ios = ['cde', 'index'];

    //Loop que cria os canais
    ios.forEach(function (element, index) {
        var channel = io.of('/' + element);
        channel.on('connection', function (socket) {
            console.log('a user connected at ' + element + ' channel');

            socket.on('chat message', function (msg) {
                if (element == 'cde')
                    socket.broadcast.emit('chat message', msg);
                else
                    channel.emit('chat message', msg);
            });

            socket.on('disconnect', function () {
                console.log('user disconnected from ' + element + ' channel');
            });

        });
    });
}
const EventEmitter = require('events');
class EventClass extends EventEmitter { };
const eventClass = new EventClass();
const eventNames = {
    socketIO: {
        create: 'socket-create-channel',
        emit: 'socket-emit'
    }
}
module.exports = {
    Init: Init,
    emit: emit
}

//Inicializa IO criando os canais
function Init() {
    socketIO.sockets.on('connection', function (socket) {
        // once a client has connected, we expect to get a ping from them saying what room they want to join
        console.log('a connection');
        socket.on('rooms', function (rooms) {
            rooms.forEach(function (room) {
                console.log('a join on ' + room);
                socket.join(room);
            });
        });

        socket.on('notification', function (sender) {
            
            eventClass.emit(eventNames.socketIO.emit, sender);
        });

        socket.on('disconnect', function (param1, param2, param3) {
            console.log('user disconnected from channel');
        });
    });
}

/**
 * Emite algo para os canais do socket socketIO.
 */
function emit(sender) {
    eventClass.emit(eventNames.socketIO.emit, sender);
}

//Node Emmiter
eventClass.on(eventNames.socketIO.emit, function (sender) {
    sender.channels.forEach(function (item) {
        socketIO.sockets.in(item).emit('notification', sender.value);
        console.log('Node Emitter - ' + item);
    });
});
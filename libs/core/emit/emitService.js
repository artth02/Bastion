const EventEmitter = require('events');
class EventClass extends EventEmitter { };
const eventClass = new EventClass();
const eventNames = {
    socketIO: {
        emit: 'emit-notification',
        broadcast: 'broadcast-notification',
        notification: 'bastion-notification'
    }
}
module.exports = {
    Init: Init,
    notification: {
        emit: emit
    }
}

//Inicializa IO criando os canais
function Init() {
    socketIO.sockets.on('connection', function (socket) {
        // once a client has connected, we expect to get a ping from them saying what room they want to join
        console.log('a connection');
        socket.on('rooms', function (rooms) {
            console.log(rooms);
            if (typeof (rooms) == String) {
                console.log('a join on ' + rooms);
                socket.join(rooms);
            } else {
                rooms.forEach(function (room) {
                    console.log('a join on ' + room);
                    socket.join(room);
                });
            }

        });

        socket.on(eventNames.socketIO.emit, function (sender) {
            for (var prop in socket.rooms) {
                if (typeof socket.rooms[prop] != socket.id) {
                    socket.in(prop).emit(eventNames.socketIO.notification, sender.value);
                }
            }
        });

        socket.on(eventNames.socketIO.broadcast, function (sender) {
            // socket.broadcast.in(socket.room).emit(eventNames.socketIO.notification, sender.value);
            for (var prop in socket.rooms) {
                if (typeof socket.rooms[prop] != socket.id) {
                    socket.broadcast.in(prop).emit(eventNames.socketIO.notification, sender.value);
                }
            }
        });

        socket.on('disconnect', function () {
            console.log('user disconnected from channel');
        });
    });
}

/**
 * Emite algo para os canais do socket socketIO.
 */
function emit(sender) {
    emitNotification(sender);
}

//Node Emmiter
function emitNotification(sender) {
    sender.channels.forEach(function (item) {
        socketIO.sockets.in(item).emit(eventNames.socketIO.notification, sender.value);
    });
};
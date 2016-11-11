const EventEmitter = require('events');
class EventClass extends EventEmitter { };
const eventClass = new EventClass();
const eventNames = {
    socketIO: {
        emit: 'bastion-emit-notification',
        broadcast: 'bastion-broadcast-notification',
        notification: 'bastion-notification',
        join: 'bastion-join'
    }
};

const namespaces = {
    notification: '/bastion/notification'
};

module.exports = {
    Init: Init,
    emit: emit
};

//Inicializa IO criando os canais
function Init() {
    global.connectedClients = {};
    var notificationNamespace = socketIO.of(namespaces.notification);
    notificationNamespace.on('connection', function (socket) {
        console.log('Connected as: ' + socket.id);

        socket.on(eventNames.socketIO.join, function (connectionOptions, ...channels) {
            //Mapeando ID usuário conectado com id do socket;
            socket.user = connectionOptions.user;
            connectedClients[socket.user] = socket.id;

            //Conectando nos canais do parametro
            console.log('Joined as: ' + socket.user);
            channels.forEach(function (channelName) {
                console.log(socket.user + ' joined on ' + channelName);
                socket.join(channelName);
            });
        });

        //Evento disparado quando recebido EMIT de algum dos sockets
        socket.on(eventNames.socketIO.emit, function (message, ...channels) {
            // for (var prop in socket.rooms) {
            // if (typeof socket.rooms[prop] != socket.user) {

            channels.forEach(function (channelName) {
                socket.in(channelName).emit(eventNames.socketIO.notification, message.notification);
            })
            // }
            // }
        });

        //Evento disparado quando recebido broadcast de algum dos sockets
        socket.on(eventNames.socketIO.broadcast, function (message,...channels) {
            // for (var prop in socket.rooms) {
            // if (typeof socket.rooms[prop] != socket.user) {
            channels.forEach(function (channelName) {
                socket.broadcast.in(channelName).emit(eventNames.socketIO.notification, message.notification);
            });
        });

        //Disparado sempre que houver uma desconexão
        socket.on('disconnect', function () {
            delete connectedClients[socket.user];
            console.log('Disconnected: ' + socket.user);
        });
    });
}

/**
 * Emite algo para os canais do socket socketIO.
 * (Função chamada apenas via POST na API)
 */
function emit(sender) {
    sender.meta.channels.forEach(function (item) {
        socketIO.of(namespaces.notification).in(item).emit(eventNames.socketIO.notification, sender.notification);
    });
}
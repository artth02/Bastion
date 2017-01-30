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
    emit: emit,
    inspect: inspect,
    inspectChannel: inspectChannel
};

//Inicializa IO criando os canais
function Init() {
    global.connectedClients = {};
    var notificationNamespace = socketIO.of(namespaces.notification);
    notificationNamespace.on('connection', function(socket) {
        //console.log('Connected as: ' + socket.id);

        socket.on(eventNames.socketIO.join, function(connectionOptions, ...channels) {
            //Mapeando ID usuário conectado com id do socket;
            socket.customId = connectionOptions.customId;
            connectedClients[socket.customId] = socket.id;

            //Conectando nos canais do parametro
            //console.log('Joined as: ' + socket.customId);
            channels.forEach(function(channelName) {
                // console.log(socket.customId + ' joined on ' + channelName);
                socket.join(channelName);
            });
        });

        //Evento disparado quando recebido EMIT de algum dos sockets
        socket.on(eventNames.socketIO.emit, function(message, ...channels) {
            channels.forEach(function(channelName) {
                socket.in(channelName).emit(eventNames.socketIO.notification, message.notification);
            });
        });

        //Evento disparado quando recebido broadcast de algum dos sockets
        socket.on(eventNames.socketIO.broadcast, function(message, ...channels) {
            // for (var prop in socket.rooms) {
            // if (typeof socket.rooms[prop] != socket.customId) {
            channels.forEach(function(channelName) {
                socket.broadcast.in(channelName).emit(eventNames.socketIO.notification, message.notification);
            });
        });

        //Disparado sempre que houver uma desconexão
        socket.on('disconnect', function() {
            delete connectedClients[socket.customId];
            console.log('Disconnected: ' + socket.customId);
        });
    });
}

/**
 * Emite sinal para os canais do socket socketIO.
 * (Função chamada apenas via POST na API)
 */
function emit(sender) {
    sender.meta.channels.forEach(function(item) {
        socketIO.of(namespaces.notification).in(item).emit(eventNames.socketIO.notification, sender.notification);
    });
}

function inspect(callback) {
    var notificationChannels = socketIO.of(namespaces.notification).adapter.rooms;
    var result = [];
    for (var prop in notificationChannels) {
        if (prop.toString().indexOf('/') == -1)
            result.push({
                channelName: prop,
                length: notificationChannels[prop].length
            });
    }
    callback(result);
}

function inspectChannel(channelName, callback) {
    var socketsInChannel = socketIO.of(namespaces.notification).in(channelName).sockets;
    var result = [];
    for (var prop in socketsInChannel) {
        if (socketsInChannel[prop].rooms[channelName])
            result.push({
                socketId: socketsInChannel[prop].id,
                customId: socketsInChannel[prop].customId,
            });
    }
    callback(result);
}
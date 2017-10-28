module.exports = {
    api: {
        env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 10007,
        cluster: process.env.CLUSTER
    },
    socketIO: {
        port: process.env.IOPORT || 10008
    }
};

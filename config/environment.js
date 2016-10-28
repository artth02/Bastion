
'use strict';

const appPort = process.env.APORT || 10007,
    relational = {
        user: process.env.RELATIONAL_USER || "usr_mladmin",
        password: process.env.RELATIONAL_PASSWORD || "!usr_mladmin!",
        connectString: process.env.RELATIONAL || '10.0.0.190:1800/xe'
    },
    aion = process.env.AYON || 'amqp://192.168.7.26:5672';

module.exports = {
    port: appPort,
    clusters: process.env.CLUSTERS || 1,
    aion: aion,
    relational
};
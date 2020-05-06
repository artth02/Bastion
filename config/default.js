const dotenv = require('dotenv')
const path = require('path')

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const envPath = path.join(__dirname, './../.env')

try {
  dotenv.config({
    path: envPath
  })
} catch (err) {
  console.info(envPath + ' not found, load by environment variables')
}

module.exports = {
  api: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 10007,
    cluster: process.env.CLUSTER
  },
  socketIO: {
    port: process.env.IOPORT || 10008,
    broker: process.env.SOCKET_BROKER
  },
  aws: {
    configured: process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
    credentials: {
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID
    },
    sns: {
      enabled: process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SNS_TOPIC_ARN,
      TopicArn: process.env.AWS_SNS_TOPIC_ARN,
      Protocol: process.env.AWS_SNS_PROTOCOL,
      Endpoint: process.env.AWS_SNS_SUBSCRIBE_TO_ENDPOINT,
      Attributes: {},
      ReturnSubscriptionArn: false
    }
  }
}

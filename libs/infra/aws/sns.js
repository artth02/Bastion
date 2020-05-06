const env = require('config')
const AWS = require('aws-sdk')

function subscribe (server) {
  const sns = new AWS.SNS({
    region: env.aws.region,
    params: {
      TopicArn: env.aws.sns.TopicArn,
      Protocol: env.aws.sns.Protocol,
      Endpoint: `${server.info.uri}/bastion/notification`
    }

  })

  sns.subscribe((err, data) => {
    if (err) {
      console.error('SNS |', err)
    } else {
      console.info('SNS | subscribed to sns: ', env.aws.sns.TopicArn)
      console.info('SNS | data', data)
    }
  })
}

module.exports = {
  subscribe
}

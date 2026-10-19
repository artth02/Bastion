const env = require('config')
const { SNSClient, SubscribeCommand } = require('@aws-sdk/client-sns')

async function subscribe (server) {
  const sns = new SNSClient({ region: env.aws.region })

  try {
    const data = await sns.send(new SubscribeCommand({
      TopicArn: env.aws.sns.TopicArn,
      Protocol: env.aws.sns.Protocol,
      Endpoint: `${server.info.uri}/bastion/notification`
    }))
    console.info('SNS | subscribed to sns: ', env.aws.sns.TopicArn)
    console.info('SNS | data', data)
  } catch (err) {
    console.error('SNS |', err)
  }
}

module.exports = {
  subscribe
}

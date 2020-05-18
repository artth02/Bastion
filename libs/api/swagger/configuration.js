const packagejson = require('./../../../package.json')
const basePath = '/bastion'

module.exports = {
  swaggered: {
    plugin: require('hapi-swaggered'),
    requiredtags: ['api'],
    options: {
      cors: false,
      endpoint: '/documentation',
      responseValidation: false,
      info: {
        title: `${packagejson.name} manifest`,
        description: packagejson.description,
        version: packagejson.version,
        contact: {
          url: 'https://github.com/artth02/bastion'
        }
      },
      tagging: {
        mode: 'tags'
      }
    }
  },
  swaggeredUi: {
    plugin: require('hapi-swaggered-ui'),
    options: {
      authorization: {
        field: 'Authorization',
        scope: 'header',
        defaultValue: 'demoKey',
        placeholder: 'Authorization token here'
      },
      swaggerOptions: {
        validatorUrl: null
      },
      title: 'Bastion',
      path: `${basePath}/documentation`
    },
    supportedMethod: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
}

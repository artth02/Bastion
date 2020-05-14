const packagejson = require('./../../../package.json')
const basePath = '/bastion'

module.exports = {
  swaggered: {
    register: require('hapi-swaggered'),
    requiredtags: ['api'],
    options: {
      info: {
        title: `${packagejson.name} manifest`,
        description: packagejson.description,
        version: packagejson.version,
        contact: {
          url: 'https://github.com/artth02/bastion'
        }
      },
      stripPrefix: basePath,
      tagging: {
        mode: 'tags'
      }
    }
  },
  swaggeredUi: {
    register: require('hapi-swaggered-ui'),
    options: {
      auth: false,
      authorization: {
        field: 'Authorization',
        scope: 'header',
        placeholder: 'Authorization token here'
      },
      title: 'Bastion',
      path: `${basePath}/documentation`
    },
    supportedMethod: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
}

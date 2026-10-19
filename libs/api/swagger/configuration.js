const packagejson = require('./../../../package.json')
const basePath = '/bastion'

module.exports = {
  swagger: {
    plugin: require('hapi-swagger'),
    options: {
      documentationPath: `${basePath}/documentation`,
      jsonPath: '/documentation',
      grouping: 'tags',
      info: {
        title: `${packagejson.name} manifest`,
        description: packagejson.description,
        version: packagejson.version,
        contact: {
          url: 'https://github.com/artth02/bastion'
        }
      },
      securityDefinitions: {
        Authorization: { type: 'apiKey', name: 'Authorization', in: 'header' }
      },
      validatorUrl: null
    }
  }
}

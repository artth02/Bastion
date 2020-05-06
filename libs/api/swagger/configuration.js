module.exports = {
  swaggered: {
    register: require('hapi-swaggered'),
    requiredtags: ['api'],
    options: {
      info: {
        title: 'Bastion Manifest',
        description: 'An Web-API to broadcast json with socket io and http requests for his clients.',
        version: '6.6.6',
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
    register: require('hapi-swaggered-ui'),
    options: {
      title: 'Bastion',
      path: '/bastion/documentation'
    },
    supportedMethod: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
}

module.exports = (server) => {
  server.ext('onPreResponse', function (request, reply) {
    let response = request.response
    let genericalMessage = {
      '400': 'Invalid informations.',
      '404': 'Resource not found.',
      '500': 'Internal server error.'
    }

    if (response.isBoom) {
      response.output.payload.moreInfo = {
        message: (response.data.name === 'ValidationError') ? response.output.payload.message : response.message,
        validation: response.output.payload.validation
      }

      response.output.payload.message = genericalMessage[response.output.payload.statusCode]

      delete response.output.payload.error
      delete response.output.payload.validation
    }

    return reply.continue()
  })
}

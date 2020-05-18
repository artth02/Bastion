module.exports = (server) => {
  server.ext('onPreResponse', (request, reply) => {
    const response = request.response
    const genericalMessage = {
      400: 'Invalid informations.',
      404: 'Resource not found.',
      500: 'Internal server error.'
    }

    if (response.isBoom) {
      console.error(response.stack)
      response.output.payload.moreInfo = {
        message: (response.data && response.data.name === 'ValidationError') ? response.output.payload.message : response.message,
        validation: response.output.payload.validation
      }

      response.output.payload.message = genericalMessage[response.output.payload.statusCode]

      delete response.output.payload.error
      delete response.output.payload.validation
    }

    return reply.continue
  })
}

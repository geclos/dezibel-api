const codes = {
  204: 'Resource not found',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  500: 'Internal server error'
}

module.exports = {
  create (code, message) {
    return {
      statusCode: code,
      message: message || '',
      error: codes[code] || 'Unknown'
    }
  },

  isValidError (err) {
    return (
      (err.error != null && typeof err.error === 'string') &&
      (err.message != null && typeof err.message === 'string') &&
      err.statusCode != null && typeof err.statusCode === 'number'
    )
  },

  unknown (err) {
    if (this.isValidError(err)) {
      return err
    } else if (err instanceof Error) {
      return this.create(500, err.message)
    } else {
      return this.create(500)
    }
  }
}


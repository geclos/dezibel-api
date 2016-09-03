const codes = {
  204: 'Resource not found',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  500: 'Internal server error'
}

module.exports = {
  FORBIDDEN: create(403),
  UNAUTHORIZED: create(401),
  RESOURCE_NOT_FOUND: create(204),
  INTERNAL_SERVER_ERROR: create(500),

  create: create,
  isValidError: isValidError,
  unknown: handleUnknownError
}

function create (code, message) {
  return {
    statusCode: code,
    message: message || '',
    error: codes[code] || 'Unknown'
  }
}

function isValidError (err) {
  return (
    err != null &&
    (err.error != null && typeof err.error === 'string') &&
    (err.message != null && typeof err.message === 'string') &&
    err.statusCode != null && typeof err.statusCode === 'number'
  )
}

function handleUnknownError (err) {
  if (this.isValidError(err)) {
    return err
  } else if (err instanceof Error) {
    return this.create(500, err.message)
  } else {
    return this.create(500)
  }
}

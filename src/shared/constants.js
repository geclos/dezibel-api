const roles = exports.roles = [
  'ADMIN',
  'VENUE',
  'BAND',
  'USER'
]

exports.error = {
  204: 'Resource not found',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  500: 'Internal server error',
  create: function (code, message) {
    return {
      error: this[code] || 'Unknown',
      message: message || '',
      statusCode: code
    }
  }
}

exports.getValidUserType = userType => {
  if (userType == null || typeof userType !== 'string') {
    return undefined
  }

  if (roles.indexOf(userType.toUpperCase()) > -1) {
    return userType.toUpperCase()
  } else {
    return undefined
  }
}

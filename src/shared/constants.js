exports.roles = [
  'ADMIN',
  'VENUE',
  'BAND',
  'USER'
]

exports.error = {
  create: (code, message, error) => ({
    statusCode: code,
    error: error || message,
    message
  })
}

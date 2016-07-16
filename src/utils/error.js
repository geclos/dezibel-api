exports.create = (code, message, error) => ({
  statusCode: code,
  error: error || message,
  message
})

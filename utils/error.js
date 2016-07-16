exports.create = (code, message, error) => ({
  message,
  statusCode: code,
  error: error || message
})

exports.handlePromise = (req, reply, promise) => {
  return promise(req)
    .then(reply)
    .catch(err => reply(err).code(err.statusCode))
}

exports.isValidUser = (req) =>
  req.params.id === req.auth.credentials.user.id

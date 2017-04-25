exports.register = (server, options, next) => {
  server.app.users = Users(server.app.redis)
  next()
}

exports.register.attributes = { name: 'users' }

function Users (db) {
  return { get, getFromEmail }

  function get (id) {
    return db.hgetallAsync(`user:${id}`)
  }

  function getFromEmail (email) {
    return db.getAsync(`user:${email}`).then(get)
  }
}

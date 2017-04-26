const redis = require('redis')
const bcrypt = require('bcrypt')
const client = redis.createClient(6379, 'localhost')

module.exports = () =>
  new Promise((resolve, reject) => {
    client.flushdb(err => {
      if (err) {
        return reject(err)
      }

      bcrypt.hash('123456', 10, (err, hash) => {
        if (err) return reject(err)

        const user = {
          hash,
          id: 1,
          firsName: 'foo',
          lastName: 'bar',
          email: 'foo@bar.com'
        }

        const multi = client.multi()

        multi.rpush('users', user.id)
        multi.hmset(`user:${user.id}`, user)
        multi.set(`user:${user.email}`, user.id)

        multi.exec(err => {
          if (err) {
            return reject(err)
          }

          resolve()
        })
      })
    })
  })

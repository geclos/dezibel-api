if (process.env.NODE_ENV === 'production') {
  module.exports = require('./production')
} else if (process.env.NODE_ENV === 'development') {
  module.exports = require('./development')
}

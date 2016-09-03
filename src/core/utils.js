const error = require('../utils/error')
exports.catchUnknownErrors = (reject, err) => reject(error.unknown(err))

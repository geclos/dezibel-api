const error = require('../shared/error')
exports.catchUnknownErrors = (reject, err) => reject(error.unknown(err))

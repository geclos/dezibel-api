const roles = exports.roles = [
  'ADMIN',
  'VENUE',
  'BAND',
  'USER'
]

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

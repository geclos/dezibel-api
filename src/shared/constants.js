// BE CAREFUL, DO NOT change the order of this array,
// it determines a scale of rights from the user with less rights (user)
// and the user with more rights (admin)
const roles = exports.roles = [
  'ADMIN',
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

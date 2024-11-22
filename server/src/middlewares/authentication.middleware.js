const jwt = require('jsonwebtoken')
const { CustomError } = require('../utils/error.util')

class Authentication {
  async verify(req, res, next) {
    try {
      const bearerHeader = req.headers.authorization

      if (!bearerHeader) {
        throw new CustomError(401, 'Token is required')
      }
      const token = bearerHeader.replace('Bearer ', '')
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          throw new CustomError(401, 'Invalid token')
        }
        req.user = { ...decoded, id: decoded._id }
        next()
      })
    } catch (err) {
      next(err)
    }
  }

  checkPermission(allowedPermissions = []) {
    return (req, res, next) => {
      const permissions = req.user.role.permissions
      if (
        !permissions.some((permission) =>
          allowedPermissions.includes(permission)
        )
      ) {
        next(new CustomError(403, 'Forbidden'))
      }
      next()
    }
  }

  checkRole(allowedRoles = []) {
    return (req, res, next) => {
      const role = req.user.role.name
      if (!allowedRoles.includes(role)) {
        next(new CustomError(403, 'Forbidden'))
      }
      next()
    }
  }
}

module.exports = Authentication

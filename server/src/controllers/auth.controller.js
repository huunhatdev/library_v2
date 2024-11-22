const { authService } = require('../services')
const { responseUtil } = require('../utils/response.util')

class AuthController {
  async login(req, res, next) {
    try {
      const data = await authService.login(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async register(req, res, next) {
    try {
      const data = await authService.register(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = AuthController

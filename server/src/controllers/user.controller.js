const { userService } = require('../services')
const { responseUtil } = require('../utils/response.util')
class UserController {
  async getUsers(req, res, next) {
    try {
      const data = await userService.getUsers(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async getUserById(req, res, next) {
    try {
      const data = await userService.getUserById(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async createUser(req, res, next) {
    try {
      const data = await userService.createUser(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async updateUser(req, res, next) {
    try {
      const data = await userService.updateUser(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(req, res, next) {
    try {
      const data = await userService.deleteUser(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async changePassword(req, res, next) {
    try {
      const data = await userService.changePassword(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async getProfile(req, res, next) {
    try {
      const data = await userService.getProfile(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { email, fullName } = req.body
      const data = await userService.updateUser({
        params: { id: req.user.id },
        body: { email, fullName }
      })
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController

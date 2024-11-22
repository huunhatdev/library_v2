const { roleService } = require('../services')
const { responseUtil } = require('../utils/response.util')

class RoleController {
  async getRoles(req, res, next) {
    try {
      const data = await roleService.getRoles(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async getRoleById(req, res, next) {
    try {
      const data = await roleService.getRoleById(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async createRole(req, res, next) {
    try {
      const data = await roleService.createRole(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async updateRole(req, res, next) {
    try {
      const data = await roleService.updateRole(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async deleteRole(req, res, next) {
    try {
      const data = await roleService.deleteRole(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = RoleController

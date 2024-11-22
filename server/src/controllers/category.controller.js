const { categoryService } = require('../services')
const { responseUtil } = require('../utils/response.util')

class CategoryController {
  async getCategories(req, res, next) {
    try {
      const data = await categoryService.getCategories(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const data = await categoryService.getCategoryById(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async createCategory(req, res, next) {
    try {
      const data = await categoryService.createCategory(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async updateCategory(req, res, next) {
    try {
      const data = await categoryService.updateCategory(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const data = await categoryService.deleteCategory(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CategoryController

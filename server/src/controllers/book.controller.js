const { bookService } = require('../services')
const { responseUtil } = require('../utils/response.util')

class BookController {
  async getBooks(req, res, next) {
    try {
      const data = await bookService.getBooks(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async getBookById(req, res, next) {
    try {
      const data = await bookService.getBookById(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async createBook(req, res, next) {
    try {
      const data = await bookService.createBook(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async updateBook(req, res, next) {
    try {
      const data = await bookService.updateBook(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async deleteBook(req, res, next) {
    try {
      const data = await bookService.deleteBook(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = BookController

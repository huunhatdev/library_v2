const express = require('express')
const { bookController } = require('../controllers')
const { authMiddleware } = require('../middlewares')
const { PERMISSIONS_TYPES } = require('../constant')
const bookRouter = express.Router()

bookRouter.get('/', bookController.getBooks)
bookRouter.get('/:id', bookController.getBookById)
bookRouter.post(
  '/',
  authMiddleware.checkPermission([PERMISSIONS_TYPES.MANAGE_BOOKS]),
  bookController.createBook
)
bookRouter.put(
  '/:id',
  authMiddleware.checkPermission([PERMISSIONS_TYPES.MANAGE_BOOKS]),
  bookController.updateBook
)
bookRouter.delete(
  '/:id',
  authMiddleware.checkPermission([PERMISSIONS_TYPES.MANAGE_BOOKS]),
  bookController.deleteBook
)

module.exports = bookRouter

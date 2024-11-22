const express = require('express')
const { categoryController } = require('../controllers')
const { PERMISSIONS_TYPES } = require('../constant')
const { authMiddleware } = require('../middlewares')
const categoryRouter = express.Router()

categoryRouter.get('/', categoryController.getCategories)
categoryRouter.get('/:id', categoryController.getCategoryById)
categoryRouter.post(
  '/',
  authMiddleware.checkPermission([PERMISSIONS_TYPES.MANAGE_BOOKS]),
  categoryController.createCategory
)
categoryRouter.put(
  '/:id',
  authMiddleware.checkPermission([PERMISSIONS_TYPES.MANAGE_BOOKS]),
  categoryController.updateCategory
)
categoryRouter.delete(
  '/:id',
  authMiddleware.checkPermission([PERMISSIONS_TYPES.MANAGE_BOOKS]),
  categoryController.deleteCategory
)

module.exports = categoryRouter

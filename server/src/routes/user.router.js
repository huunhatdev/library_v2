const express = require('express')
const { userController } = require('../controllers')
const { authMiddleware } = require('../middlewares')
const { PERMISSIONS_TYPES, ROLE_TYPES } = require('../constant')
const userRouter = express.Router()

userRouter.get('/', userController.getUsers)
userRouter.get('/:id', userController.getUserById)
userRouter.post(
  '/',
  authMiddleware.checkPermission([PERMISSIONS_TYPES.MANAGE_USERS]),
  userController.createUser
)
userRouter.put(
  '/:id',
  authMiddleware.checkPermission([PERMISSIONS_TYPES.MANAGE_USERS]),
  userController.updateUser
)
userRouter.delete(
  '/:id',
  authMiddleware.checkRole([ROLE_TYPES.ADMIN]),
  userController.deleteUser
)

module.exports = userRouter

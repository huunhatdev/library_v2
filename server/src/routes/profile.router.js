const express = require('express')
const { userController } = require('../controllers')
const profileRouter = express.Router()

profileRouter.get('/', userController.getProfile)
profileRouter.post('/change-password', userController.changePassword)
profileRouter.put('/', userController.updateProfile)

module.exports = profileRouter

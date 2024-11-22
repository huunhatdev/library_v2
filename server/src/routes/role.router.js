const express = require('express')
const { roleController } = require('../controllers')
const roleRouter = express.Router()

roleRouter.get('/', roleController.getRoles)
roleRouter.get('/:id', roleController.getRoleById)
roleRouter.put('/:id', roleController.updateRole)

module.exports = roleRouter

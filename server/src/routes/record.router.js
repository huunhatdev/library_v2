const express = require('express')
const { recordController } = require('../controllers')
const recordRouter = express.Router()

recordRouter.get('/', recordController.getRecords)
recordRouter.get('/:id', recordController.getRecordById)
recordRouter.post('/', recordController.createRecord)
recordRouter.put('/:id', recordController.updateRecord)
recordRouter.delete('/:id', recordController.deleteRecord)

module.exports = recordRouter

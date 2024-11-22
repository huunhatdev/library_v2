const { recordService } = require('../services')
const { responseUtil } = require('../utils/response.util')

class RecordController {
  async getRecords(req, res, next) {
    try {
      const data = await recordService.getRecords(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async getRecordById(req, res, next) {
    try {
      const data = await recordService.getRecordById(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async createRecord(req, res, next) {
    try {
      const data = await recordService.createRecord(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async updateRecord(req, res, next) {
    try {
      const data = await recordService.updateRecord(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }

  async deleteRecord(req, res, next) {
    try {
      const data = await recordService.deleteRecord(req)
      return responseUtil({ res, data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = RecordController

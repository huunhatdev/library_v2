const recordModel = require('../models/record.model')
const BaseRepository = require('./base.repository')

class RecordRepository extends BaseRepository {
  constructor() {
    super(recordModel)
  }
}

module.exports = RecordRepository

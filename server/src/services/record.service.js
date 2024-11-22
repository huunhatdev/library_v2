const { recordRepository } = require('../repositories')

class RecordService {
  constructor() {
    this.recordRepository = recordRepository
  }

  async getRecords({ query }) {
    return this.recordRepository.findAll(query)
  }

  async getRecordById({ params }) {
    return this.recordRepository.findById(params.id)
  }

  async createRecord({ body }) {
    return this.recordRepository.create(body)
  }

  async updateRecord({ params, body }) {
    return this.recordRepository.findOneAndUpdate({ _id: params.id }, body)
  }

  async deleteRecord({ params }) {
    return this.recordRepository.delete({ _id: params.id })
  }
}

module.exports = RecordService

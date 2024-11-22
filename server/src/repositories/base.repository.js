class BaseRepository {
  constructor(model) {
    this.model = model
  }

  async create(data) {
    return await this.model.create(data)
  }

  async findById(id, ...rest) {
    return await this.model.findById(id, ...rest)
  }

  async findOne(query) {
    return await this.model.findOne(query)
  }

  async findAll(query, ...rest) {
    return await this.model.find(query, ...rest)
  }

  async findOneAndUpdate(query, data) {
    return await this.model.findOneAndUpdate(query, data, { new: true })
  }

  async update(query, data) {
    return await this.model.updateOne(query, data)
  }

  async updateMany(query, data) {
    return await this.model.updateMany(query, data)
  }

  async delete(query) {
    return await this.model.deleteOne(query)
  }
}

module.exports = BaseRepository

const userModel = require('../models/user.model')
const BaseRepository = require('./base.repository')

class UserRepository extends BaseRepository {
  constructor() {
    super(userModel)
  }
}

module.exports = UserRepository

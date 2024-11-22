const roleModel = require('../models/role.model')
const BaseRepository = require('./base.repository')

class RoleRepository extends BaseRepository {
  constructor() {
    super(roleModel)
  }
}

module.exports = RoleRepository

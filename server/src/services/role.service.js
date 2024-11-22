const { roleRepository } = require('../repositories')

class RoleService {
  constructor() {
    this.roleRepository = roleRepository
  }

  async getRoles({ query }) {
    return this.roleRepository.findAll(query)
  }

  async getRoleById({ params }) {
    return this.roleRepository.findById(params.id)
  }

  async createRole({ body }) {
    return this.roleRepository.create(body)
  }

  async updateRole({ params, body }) {
    const { permissions } = body
    return this.roleRepository.findOneAndUpdate(
      { _id: params.id },
      { permissions }
    )
  }
}

module.exports = RoleService

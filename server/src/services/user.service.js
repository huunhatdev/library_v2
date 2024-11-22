const { userRepository } = require('../repositories')

class UserService {
  constructor() {
    this.userRepository = userRepository
  }

  async getUsers({ query }) {
    return this.userRepository.findAll(query, '-password')
  }

  async getUserById({ params }) {
    return this.userRepository.findById(params.id, '-password')
  }

  async getProfile({ user }) {
    const { id: userId } = user
    return this.userRepository.findById(userId, '-password')
  }

  async createUser({ body }) {
    return this.userRepository.create(body)
  }

  async updateUser({ params, body }) {
    const { email, fullName } = body
    if (!email || !fullName) {
      throw new CustomError(400, 'Email and full name are required')
    }
    return this.userRepository.findOneAndUpdate(
      { _id: params.id },
      { email, fullName }
    )
  }

  async deleteUser({ params }) {
    return this.userRepository.delete({ _id: params.id })
  }

  async changePassword({ body, user }) {
    const { id: userId } = user
    const { oldPassword, newPassword } = body

    const myUser = await this.userRepository.findById(userId)
    const isMatch = await bcrypt.compare(oldPassword, myUser.password)
    if (!isMatch) {
      throw new CustomError(400, 'Old password is incorrect')
    }

    return this.userRepository.findOneAndUpdate(
      { _id: userId },
      { password: bcrypt.hashSync(newPassword, 10) }
    )
  }
}

module.exports = UserService

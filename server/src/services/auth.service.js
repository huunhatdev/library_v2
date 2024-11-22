const { userRepository, roleRepository } = require('../repositories')
const { CustomError } = require('../utils/error.util')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class AuthService {
  constructor() {
    this.userRepository = userRepository
    this.roleRepository = roleRepository
  }

  async login({ body }) {
    const { username, password } = body
    const user = await this.userRepository.findOne({ username })
    if (!user) {
      throw new CustomError(400, 'User not found')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new CustomError(400, 'Invalid password')
    }

    const userWithoutPassword = { ...user.toObject(), password: undefined }

    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    return { profile: userWithoutPassword, token }
  }

  async register({ body }) {
    const { username, email, password, fullName } = body

    const role = await this.roleRepository.findOne({ name: 'member' })
    if (!role) {
      throw new CustomError(400, 'Role not found')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: role._id
    })

    const userWithoutPassword = { ...user.toObject(), password: undefined }
    return userWithoutPassword
  }
}

module.exports = AuthService

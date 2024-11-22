const RecordRepository = require('./record.repository')
const CategoryRepository = require('./category.repository')
const UserRepository = require('./user.repository')
const BookRepository = require('./book.repository')
const RoleRepository = require('./role.repository')

const bookRepository = new BookRepository()
const recordRepository = new RecordRepository()
const categoryRepository = new CategoryRepository()
const userRepository = new UserRepository()
const roleRepository = new RoleRepository()

module.exports = {
  bookRepository,
  recordRepository,
  categoryRepository,
  userRepository,
  roleRepository
}

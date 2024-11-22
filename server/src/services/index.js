const AuthService = require('./auth.service')
const RoleService = require('./role.service')
const CategoryService = require('./category.service')
const RecordService = require('./record.service')
const BookService = require('./book.service')
const UserService = require('./user.service')

module.exports = {
  authService: new AuthService(),
  roleService: new RoleService(),
  categoryService: new CategoryService(),
  recordService: new RecordService(),
  bookService: new BookService(),
  userService: new UserService()
}

const AuthController = require('./auth.controller')
const BookController = require('./book.controller')
const CategoryController = require('./category.controller')
const RecordController = require('./record.controller')
const RoleController = require('./role.controller')
const UserController = require('./user.controller')

module.exports = {
  authController: new AuthController(),
  bookController: new BookController(),
  categoryController: new CategoryController(),
  recordController: new RecordController(),
  roleController: new RoleController(),
  userController: new UserController()
}

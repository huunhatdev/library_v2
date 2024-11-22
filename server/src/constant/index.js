const ROLE_TYPES = {
  ADMIN: 'admin',
  LIBRARIAN: 'librarian',
  MEMBER: 'member'
}
const USER_ROLES = Object.values(ROLE_TYPES)

const PERMISSIONS_TYPES = {
  MANAGE_USERS: 'manage_users',
  MANAGE_BOOKS: 'manage_books',
  VIEW_BOOKS: 'view_books',
  BORROW_BOOKS: 'borrow_books',
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_RECORDS: 'manage_records'
}

const RECORD_STATUS_TYPES = {
  BORROWED: 'borrowed',
  RETURNED: 'returned'
}
const RECORD_STATUS = Object.values(RECORD_STATUS_TYPES)

module.exports = {
  ROLE_TYPES,
  USER_ROLES,
  PERMISSIONS_TYPES,
  RECORD_STATUS_TYPES,
  RECORD_STATUS
}

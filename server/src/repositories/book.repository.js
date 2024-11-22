const bookModel = require('../models/book.model')
const BaseRepository = require('./base.repository')

class BookRepository extends BaseRepository {
  constructor() {
    super(bookModel)
  }
}

module.exports = BookRepository

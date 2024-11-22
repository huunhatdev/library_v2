const categoryModel = require('../models/category.model')
const BaseRepository = require('./base.repository')

class CategoryRepository extends BaseRepository {
  constructor() {
    super(categoryModel)
  }
}

module.exports = CategoryRepository

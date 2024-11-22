const { categoryRepository } = require('../repositories')

class CategoryService {
  constructor() {
    this.categoryRepository = categoryRepository
  }

  async getCategories({ query }) {
    return this.categoryRepository.findAll(query)
  }

  async getCategoryById({ params }) {
    return this.categoryRepository.findById(params.id)
  }

  async createCategory({ body }) {
    return this.categoryRepository.create(body)
  }

  async updateCategory({ params, body }) {
    return this.categoryRepository.findOneAndUpdate({ _id: params.id }, body)
  }

  async deleteCategory({ params }) {
    return this.categoryRepository.delete(params.id)
  }
}

module.exports = CategoryService

const { default: mongoose } = require('mongoose')
const { bookRepository } = require('../repositories')

class BookService {
  constructor() {
    this.bookRepository = bookRepository
  }

  async getBooks({ query }) {
    return this.bookRepository.findAll(query)
  }

  async getBookById({ params }) {
    return this.bookRepository.findById(params.id)
  }

  async createBook({ body }) {
    const { quantity } = body
    const availableQuantity = quantity
    return this.bookRepository.create({
      ...body,
      availableQuantity
    })
  }

  async updateBook({ params, body }) {
    return this.bookRepository.findOneAndUpdate({ _id: params.id }, body)
  }

  async deleteBook({ params }) {
    return this.bookRepository.delete({ _id: params.id })
  }
}

module.exports = BookService

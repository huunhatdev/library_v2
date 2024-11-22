const { default: mongoose } = require('mongoose')
const { RECORD_STATUS } = require('../constant')

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: true
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      autopopulate: true
    },
    borrowedAt: {
      type: Date,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    returnedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: RECORD_STATUS,
      required: true
    }
  },
  { timestamps: true }
)

recordSchema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('Record', recordSchema)

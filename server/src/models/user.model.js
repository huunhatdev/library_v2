const { default: mongoose } = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      autopopulate: true
    }
  },
  { timestamps: true }
)

userSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('User', userSchema)

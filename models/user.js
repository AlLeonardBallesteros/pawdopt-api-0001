const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String,
          default: "user"},
  verified: {
            type: Boolean,
            default: false
          },
  message: {type: String},
  resetPasswordToken: String,
  resetPasswordExpires: Date
        });

userSchema.statics.register = async function(firstname ,lastname, email, password) {

  // validation
  if (!firstname || !lastname || !email || !password ) {

    throw Error('All fields must be filled')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ firstname, lastname, email, password: hash})

  return user
}

// static login method
userSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

module.exports = mongoose.model('Users', userSchema)

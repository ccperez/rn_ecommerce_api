import mongoose from "mongoose"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
		lowercase: true,
		index: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  addresses: [{
    name: String,
    mobileNo: String,
    houseNo: String,
    street: String,
    landmark: String,
    city: String,
    country: String,
    postalCode: String,
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const secret = crypto.randomBytes(32).toString("hex")

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

	this.verificationToken = secret
})

userSchema.methods.isMatchPassword = async function (inputtedPassword) {
  return bcrypt.compareSync(inputtedPassword, this.password)
}

userSchema.methods.generateToken = function generateToken(id) {
	return jwt.sign({ id }, secret, { expiresIn: '30d' })
}

const User = mongoose.model("User",userSchema)

export default User

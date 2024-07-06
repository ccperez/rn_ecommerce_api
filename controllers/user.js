import User from "../models/User.js"
import { sendVerificationEmail } from "../utils/mailer.js"

export const authUser = async (req, res) => {
	try {
		const { email, password } = req.body

		// check if the use exists
		const user = await User.findOne({ email })
		if (user && (await user.isMatchPassword(password))) {
			return res.status(200).json({ token: user.generateToken(user._id) })
		}

		return res.status(401).json({ message: "Invalid email or password" })
	} catch  (error) {
		res.status(500).json({ message: "Login Failed" })
	}
}


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if the email is already registered
    const userExists = await User.findOne({ email })
    if (userExists) {
      console.log("Email already registered:", email)
      return res.status(400).json({ message: "Email already registered" })
    }

    // Create a new user
    const newUser = new User({ name, email, password })

    // Save the user to the database
    await newUser.save()

    // Debugging statement to verify data
    console.log("New User Registered:", newUser)

    // Send verification email to the user
    // Use your preferred email service or library to send the email
    sendVerificationEmail(email, newUser.verificationToken)

    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
    })
  } catch (error) {
    console.log("Error during registration:", error)
    res.status(500).json({ message: "Registration failed" })
  }
}

export const verifyToken = async (req, res) => {
  try {
    const verificationToken = req.params.token

    // Find the user with the given verification token
    const user = await User.findOne({ verificationToken })
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" })
    }

    // Mark the user as verified
    user.verified = true
    user.verificationToken = undefined

    await user.save()

    res.status(200).json({ message: "Email verified successfully" })
  } catch (error) {
    res.status(500).json({ message: "Email Verification Failed" })
  }
}

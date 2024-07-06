import express from "express"
import {
	authUser,
  registerUser,
	verifyToken
} from "../controllers/user.js"

const router = express.Router()

router
  .route('/register')
  .post(registerUser)

router.post('/login', authUser)

router
	.route('/verify/:token')
	.get(verifyToken)

export default router

import express from 'express'
import mongoose from 'mongoose'

import dotenv from 'dotenv'

import userRoutes from './routes/user.js'

dotenv.config()

const { NODE_ENV, PORT, MONGO_URI } = process.env

mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('connected to mongodb'))
	.catch(() => console.log('error mongodb'))

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRoutes)

app.listen(PORT || '5000', () => {
  console.log(`server started at http://localhost:${PORT}`)
})

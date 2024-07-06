import nodemailer from "nodemailer"
import dotenv from 'dotenv'

dotenv.config()

const from = '"DomainEmail" <info@emaildomain.com>'

const { HOST, EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env

const setup = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
})

const sendMail = async (email, message) => {
  try {
    const transport = setup
    await transport.sendMail(email)
    console.log(`Successfully ${message}`)
  } catch (error) {
    console.error(`Error ${message} : ${error}`)
  }
}

export const sendVerificationEmail = (email, verificationToken) => {
  sendMail({
    from,
    to: email,
    subject: 'Email Verification',
    html: `
      <p>
        Please click the following link to verify your email: <br/>
        <a href="${HOST}/api/users/verify/${verificationToken}">
            ${HOST}/api/users/verify/${verificationToken}!
        </a>
      </p>
    `,
  }, "verification email")
}

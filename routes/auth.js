const router = require('express').Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Validation
const { loginAuth, registerSchemaValidation, loginSchemaValidation, sendResetSchemaValidation,resetPasswordSchemaValidation } = require('../middleware')

const { SendMailJet } = require('../mailjet')
const crypto = require('crypto')

router
.route('/register')
.post(registerSchemaValidation, async (req,res)=>{
    const {name,email,password} = req.body
    //Check for if email exists
    const existEmail = await User.findOne({email})
    if(existEmail) return res.status(400).send('This email already exists')
    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = new User({
        name, email,
        password:hashedPassword,
        emailToken:crypto.randomBytes(64).toString('hex'),
        isVerified:false,
        resetPasswordIsVerified: true,
        resetPasswordToken: null
    })
    const savedUser = await user.save()
    SendMailJet(req, savedUser, "verify")
    res.send(savedUser)
})

router
.route('/verify-email')
.post( async (req,res)=>{
    const {token} = req.query
    const user = await User.findOne({emailToken:token})
    if(!user) return res.status(400).send(`something went wrong with email verification ${token}`)
    user.emailToken = null 
    user.isVerified = true
    await user.save()
    const jwtHeaderToken = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.send(`Loggen In and this is token:${jwtHeaderToken}`)
})

router
.route('/login')
.post(loginSchemaValidation, async (req,res)=>{
    const {email,password} = req.body
    //Check for if email exists
    const user = await User.findOne({email})
    if(!user) return res.status(400).send('Something wrong with email or password')
    if(user.emailToken) return res.status(400).send(`You didn't verify your account`)
    if(user.resetPasswordToken) return res.status(400).send(`You didn't verify your reset password`)
    //Password is Correct
    const validPass = await bcrypt.compare(password, user.password)
    if(!validPass) return res.status(400).send("Invalid Password")

    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.send(`Loggen In and this is token:${token}`)
})

router
.route('/reset-password')
.post(sendResetSchemaValidation, async (req,res)=>{
    const {email} = req.body
    //Check for if email exists
    const user = await User.findOne({email})
    if(!user) return res.status(400).send('Something wrong with email')
    if(user.emailToken) return res.status(400).send(`You didn't verify your account`)
    const resetToken = await user.createResetPasswordToken()
    const savedUser = await user.save()
    SendMailJet(req, savedUser, "reset")
    res.send(`verification was sent to your email ${savedUser}`)
})

router
.route('/verify-reset')
.post(resetPasswordSchemaValidation, async (req,res)=>{
    const {token} = req.query
    const user = await User.findOne({resetPasswordToken:token})
    if(!user) return res.status(400).send(`something went wrong with reset password verification ${token}`)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const userNewPassword = {
        resetPasswordToken:null,
        resetPasswordIsVerified:true,
        password:hashedPassword
    }
    await User.findOneAndUpdate({resetPasswordToken:token},userNewPassword)
    res.send('password was changed')
})

router
.route('/logout')
.get(loginAuth, async (req,res)=>{
    delete req.user
    res.send("logged out")
})

module.exports = router


const mongoose = require('mongoose')
const {Schema} = mongoose
const crypto = require('crypto')


const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    email:{
        type:String,
        required:true,
        min:5,
        max:50
    },
    emailToken:{
        type:String,
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordIsVerified:{
        type:Boolean
    },
    isVerified:{
        type:Boolean
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:1024
    },
    date:{
        type:Date,
        default:Date.now
    }
})

userSchema.methods.createResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(64).toString('hex')
    this.resetPasswordToken = resetToken
    this.resetPasswordIsVerified = false
    console.log({resetToken}, this.resetPasswordToken)
    return resetToken
}

module.exports = mongoose.model("User", userSchema)
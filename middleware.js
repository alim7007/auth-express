const jwt = require('jsonwebtoken')
const { registerJoiSchema, loginJoiSchema, sendResetJoiSchema,resetPasswordJoiSchema } = require('./joiSchemas')


//Check for authentication if logged in
const loginAuth = (req,res,next) => {
    const token = req.header("auth_token")
    if(!token) return res.status(401).send("Access denied")
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }catch(err){
        res.status(400).send("Invalid Token")
    }
}

//Check for valid Name, Email and Password
const registerSchemaValidation = (req,res,next)=> {
    const {error} = registerJoiSchema(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    next()
}   

const loginSchemaValidation = (req,res,next)=> {
    const {error} = loginJoiSchema(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    next()
}   

const sendResetSchemaValidation = (req,res,next)=> {
    const {error} = sendResetJoiSchema(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    next()
} 

const resetPasswordSchemaValidation = (req,res,next)=> {
    const {error} = resetPasswordJoiSchema(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    next()
} 


module.exports = {
    loginAuth,
    registerSchemaValidation,
    loginSchemaValidation,
    sendResetSchemaValidation,
    resetPasswordSchemaValidation
}



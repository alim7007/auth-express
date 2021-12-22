const Joi = require('@hapi/joi')


const registerJoiSchema = (data) =>{
const schema = Joi.object({
    name:Joi.string().min(3).required(),
    email:Joi.string().min(3).required().email(),
    password:Joi.string().min(2).required(),
})
return schema.validate(data)
}

const loginJoiSchema = (data) =>{
const schema = Joi.object({
    email:Joi.string().min(3).required().email(),
    password:Joi.string().min(2).required(),
})
return schema.validate(data)
}

const sendResetJoiSchema = (data) =>{
const schema = Joi.object({
    email:Joi.string().min(3).required().email(),
})
return schema.validate(data)
}

const resetPasswordJoiSchema = (data) =>{
const schema = Joi.object({
    password:Joi.string().min(2).required(),
})
return schema.validate(data)
}



module.exports = {
    registerJoiSchema,
    loginJoiSchema,
    sendResetJoiSchema,
    resetPasswordJoiSchema
}

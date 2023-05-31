const mongoose = require("mongoose")
const Joi = require("joi");
const jwt = require("jsonwebtoken")
const {config} = require("../config/secret")

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String, default:"user"
    }

},{timestamps:true})
exports.UserModel = mongoose.model("users",userSchema)


exports.createToken = (user_id,role = "user") => {
    const token = jwt.sign({_id:user_id,role},config.TOKEN_SECRET,{expiresIn:"50000mins"})
    return token;
}


exports.validateUser =(_bodyData)=>{
const joiSchema = Joi.object({
    name:Joi.string().min(2).max(150).required(),
    email:Joi.string().min(2).max(150).email().required(),
    password:Joi.string().min(3).max(150).required()
})
return joiSchema.validate(_bodyData)
}

exports.validateLogin =(_bodyData)=>{
const joiSchema = Joi.object({
    email:Joi.string().min(2).max(150).email().required(),
    password:Joi.string().min(3).max(150).required()
})
return joiSchema.validate(_bodyData)
}
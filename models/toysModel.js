const mongoose = require("mongoose")
const Joi = require("joi");

const toysSchema = new mongoose.Schema({
name:String,
info:String,
category:String,
img_url:String,
price:Number,
user_id:String
},{timestamps:true})

exports.ToysModel = mongoose.model("toys",toysSchema)

exports.valiDateToys = (_bodyData) => {
const joiSchema = Joi.object({
    name:Joi.string().min(2).max(100).required(),
    info:Joi.string().min(2).max(200).required(),
    category:Joi.string().min(2).max(50).required(),
    img_url:Joi.string().min(2).max(300),
    price:Joi.number().min(1).max(Infinity).required()
})
return joiSchema.validate(_bodyData)
}
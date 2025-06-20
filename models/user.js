const mongoose = require("mongoose")
const {Schema,model} = mongoose

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        minLength:3,
        maxLength:15
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:4
    }
})

module.exports = model("user",userSchema)
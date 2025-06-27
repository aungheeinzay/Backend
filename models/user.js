const mongoose = require("mongoose")
const {Schema,model} = mongoose

const userSchema = new Schema({
    username:{
        type:String,
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
    },
    isPremium:{
        type:Boolean,
        default:false
    },
    profile:{
        type:String,
    },
    payment_session_key:{
        type:String
    },
    resetToken:String,
    tokenExpiration:Date
})

module.exports = model("user",userSchema)
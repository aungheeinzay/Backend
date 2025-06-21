const User = require("../models/user")
const bcrypt = require("bcrypt")
exports.renderLogin=(req,res)=>{
    res.render("auth/login")
}
exports.postLogin=(req,res)=>{
   req.session.isLogin = true
    res.redirect("/")
}

exports.Logout=(req,res)=>{
    req.session.destroy()
    res.redirect("/")
}

exports.renderRegister=(req,res)=>{
    res.render("auth/register")
}

exports.register=async(req,res)=>{
    const {username,email,password} = req.body
    try{
    const user =await User.findOne({email})
    if(user){
        return res.redirect("/register")
    }
    await User.create({
        username,
        email,
        password:await bcrypt.hash(password,10)
    })
    res.redirect("/login")
    }catch(err){
        console.log(err);
    }
}
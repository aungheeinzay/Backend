const User = require("../models/user")
const nodemaler = require("nodemailer")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv").config()
const crypto = require("crypto")
const { fail } = require("assert")
const { error } = require("console")

const transporter = nodemaler.createTransport({
    service:"gmail",
    auth:{
        user:process.env.SENDER_MAIL,
        pass:process.env.MAIL_PASSWORD
    }
})

exports.renderLogin=(req,res)=>{
    res.render("auth/login",{csrfToken:req.csrfToken(),errorMsg:req.flash("error")})
}
exports.postLogin=async(req,res)=>{
  const {email,password} = req.body
  try{
    const isUser =await User.findOne({email})
    if(isUser){
        console.log(isUser);
        
        const isMatch = await bcrypt.compare(password,isUser.password)
        if(isMatch){
            req.session.isLogin = true
            req.session.userInfo = isUser
            await req.session.save()
            return res.redirect("/")
        }
    }
    req.flash("error","check your information!")
    return res.redirect('/login')
  }catch(err){
    console.log(err);
    
  }
}

exports.Logout=(req,res)=>{
    req.session.destroy()
    res.redirect("/")
}

exports.renderRegister=(req,res)=>{
    res.render("auth/register",{csrfToken:req.csrfToken(),errorMsg:req.flash("errorReg")})
}

exports.register=async(req,res)=>{
    const {username,email,password} = req.body
    try{
    const user =await User.findOne({email})
    if(user){
        req.flash("errorReg","email is already exit")
        return res.redirect("/register")
    }
    await User.create({
        username,
        email,
        password:await bcrypt.hash(password,10)
    })

    res.redirect("/login")
    transporter.sendMail({
        from:process.env.SENDER_MAIL,
        to:email,
        subject:"Register success",
        html:"<h1>Register account successsfully</h1><p>created and account using this email address in blog.io</p>",
},(err=>console.log(err)))
    }catch(err){
        console.log(err);
    }
}

exports.renderReset=(req,res)=>{
    res.render("auth/reset",{csrfToken:req.csrfToken(),errorMsg:req.flash("nomail")})
}
exports.feedBack=(req,res)=>{
    res.render("auth/feedback")
}

exports.resetLink=async(req,res)=>{
    const {email} = req.body
  try{
    crypto.randomBytes(30,async(err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect("/reset_password")
        }
        const token = buffer.toString("hex")
        const user = await User.findOne({email})
        if(!user){
            req.flash("nomail","no email exit")
            return res.redirect("/reset_password")
        }
        user.resetToken=token;
        user.tokenExpiration=Date.now()+(1000*60*60)
        await user.save()
        res.redirect("/feedBack")
        transporter.sendMail({
            from:process.env.SENDER_MAIL,
            to:email,
            subject:"Reset password link",
            html:`<h1>blog.io</h1><p>change your password by clickin these link</p><a href="http://localhost:3000/reset_password/${token}">click here</a>`
        },(err=>console.log(err)))
    })
       
    
    }catch(err){
    console.log(error);
  }
}

exports.getResetForm=(req,res)=>{
    const {token} = req.params
    res.render("auth/resetForm",{errorMsg:req.flash("noMatch"),csrfToken:req.csrfToken(),token})

}

exports.resetForm=async(req,res)=>{
    const {token} =req.params
    const{newPassword,conformPassword} = req.body
    try{
        if(newPassword === conformPassword){
            const user = await User.findOne({resetToken:token,tokenExpiration:{$gt:Date.now()}})
            user.password = await bcrypt.hash(newPassword,10),
            user.resetToken=null,
            user.tokenExpiration=null,
            await user.save()
            res.redirect("/login")
        }
        req.flash("noMatch","passwords must be same")
        return res.redirect(`/reset_password/${token}`)
    }catch(err){
        console.log(err);
    }
}
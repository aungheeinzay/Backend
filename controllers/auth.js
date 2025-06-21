const User = require("../models/user")
const bcrypt = require("bcrypt")
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
    }catch(err){
        console.log(err);
    }
}
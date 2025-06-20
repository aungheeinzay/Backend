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
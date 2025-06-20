const express = require("express")
const app = express()
const path =require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const User = require("./models/user")
const dotenv = require("dotenv").config()

const postRouter = require("./routers/posts")
const adminRouter = require("./routers/admin")
const authRouter = require("./routers/auth")

app.set("view engine","ejs")
app.set("views",'views')

app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.urlencoded({extended:false}))

app.use((req,res,next)=>{
    User.findById("6855746a7581ce8df642259a").then((user)=>{
        req.user = user
        next()
    })
})

app.use(postRouter)
app.use("/admin",adminRouter)
app.use(authRouter)
mongoose.connect(process.env.MONGODB_URL).then((result)=>{
app.listen(3000)
console.log("connected to mongoose");
return User.findOne().then((user)=>{
    if(!user){
        return User.create({
            username:"aung",
            email:"ahz007aunghz@gmail.com",
            password:"12347"
        })
    }
    return user
})
    
}).then((user)=>{
    console.log(user)
}).catch(err=>console.log(err))
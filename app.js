const express = require("express")
const app = express()
const csrf = require("csurf")
const path =require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
const mongoStore = require("connect-mongodb-session")(session)
const User = require("./models/user")
const dotenv = require("dotenv").config()
const multer = require("multer")
const postRouter = require("./routers/posts")
const adminRouter = require("./routers/admin")
const authRouter = require("./routers/auth")
const{isLogin} =require("./middleware/isLogin")
const flash = require("connect-flash")

app.set("view engine","ejs")
app.set("views",'views')


app.use(express.static(path.join(__dirname,"public")))
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use(bodyParser.urlencoded({extended:false}))


const storageConfigure = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads")
    },
    filename:(req,file,cb)=>{
        const unique = Date.now()+"-"+Math.round(Math.random()*1E9)+"blog.io_"
        cb(null,unique+"."+file.originalname.split(".")[1])
    }
})
const fileFilter = (req,file,cb)=>{
    if(
        file.mimetype==='image/jpeg' ||
        file.mimetype==='image/jpg'  ||
        file.mimetype==='image/png'
    ){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
app.use(multer({storage:storageConfigure,fileFilter}).single("image_url"))
const store  = new mongoStore({
    uri:process.env.MONGODB_URI,
    collection:"session"
})
const csrfProtection = csrf()

app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:false,
    store,
    
}))

app.use(csrfProtection)
app.use((req,res,next)=>{
    if(req.session.isLogin===undefined){
      return   next()
    }

    
    User.findById(req.session.userInfo._id).select("username email").then((user)=>{
        console.log(user);
        req.user=user
        next()
    }).catch(err=>console.log(err))
})
app.use(flash())

app.use(postRouter)
app.use("/admin",isLogin,adminRouter)
app.use(authRouter)

app.use((err,req,res,next)=>{
    res.status(500).render("error/500")
})
app.all("/{*any}",(req,res,next)=>{
    res.status(404).render("error/fourofour")    
})//need to place this app.all() at the end of all global middleware
//if not it block all middle ware

mongoose.connect(process.env.MONGODB_URL).then((_)=>{
app.listen(3000)
console.log("connected to mongoose")
}).catch(err=>console.log(err))
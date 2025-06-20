const express = require("express")
const app = express()
const path =require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
const mongoStore = require("connect-mongodb-session")(session)
const User = require("./models/user")
const dotenv = require("dotenv").config()

const postRouter = require("./routers/posts")
const adminRouter = require("./routers/admin")
const authRouter = require("./routers/auth")

app.set("view engine","ejs")
app.set("views",'views')

app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.urlencoded({extended:false}))
const store  = new mongoStore({
    uri:process.env.MONGODB_URI,
    collection:"session"
})
app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:false,
    store
}))

app.use(postRouter)
app.use("/admin",adminRouter)
app.use(authRouter)
mongoose.connect(process.env.MONGODB_URL).then((_)=>{
app.listen(3000)
console.log("connected to mongoose")
}).catch(err=>console.log(err))
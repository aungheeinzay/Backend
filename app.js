const express = require("express")
const app = express()
const path =require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

const postRouter = require("./routers/posts")
const adminRouter = require("./routers/admin")

app.set("view engine","ejs")
app.set("views",'views')

app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.urlencoded({extended:false}))



app.use(postRouter)
app.use("/admin",adminRouter)

mongoose.connect(process.env.MONGODB_URL).then((result)=>{
app.listen(3000)

console.log("connected to mongoose");

    
}).catch(err=>console.log(err))
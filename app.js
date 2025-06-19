const express = require("express")
const app = express()
const path =require("path")
const bodyParser = require("body-parser")

const {mongodbConnector} = require("./utils/database")
const postRouter = require("./routers/posts")
const adminRouter = require("./routers/admin")

app.set("view engine","ejs")
app.set("views",'views')

app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.urlencoded({extended:false}))

app.use((req,res,next)=>{
    console.log("this is home middle ware");
    next()
})

app.use(postRouter)
app.use("/admin",adminRouter)
mongodbConnector()
app.listen(3000)
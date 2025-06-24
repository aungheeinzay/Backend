const Post = require("../models/post")
const mongoose =require("mongoose")
const { formatISO9075 } = require("date-fns");
const pdf = require("pdf-creator-node")
const fs = require("fs")
const path = require("path");
const { fileDelete } = require("../utils/fileDelete");



exports.renderHome=async(req,res)=>{
const isLogin = req.session.isLogin ? true : false
Post.find().select("title image_url description createdAt").populate("userId","username")
.sort({createdAt:-1}).then((posts)=>{

    res.render("home",{posts,isLogin,csrfToken:req.csrfToken(),account:req.user?.email})
}).catch(err=>console.log(err))
}

exports.renderDetail=async(req,res,next)=>{
    const isLogin = req.session.isLogin ? true : false
    try{
        const {postId} =req.params;
    // if(!mongoose.Types.ObjectId.isValid(postId)){
    //     return res.status(400).send("Invilid post Id")
    // }
       const post = await Post.findById(postId).populate("userId","email")
    //    if(!post){
    //     res.status(404).send("post is not found")
    // //    }
        const isCurrentUser = (post.userId.toString()==req.user?._id) ? true : false
        res.render("details",{
            isLogin,
            post,
            csrfToken:req.csrfToken(),
            isCurrentUser,
            time:formatISO9075(post.createdAt,{representation:'time'})})
        }catch(err){
        console.log(err);
        const error = new Error("Post not found")
        return next(error)
        }
}

exports.savePostAsPDF=async(req,res)=>{
    const {postId} = req.params;
    const html = fs.readFileSync(path.join(__dirname,"../","views","template","template.html"), "utf8");//to read html template
    const downloadPath = path.join(__dirname,"../","public","pdf",new Date().getTime().toString() +Math.round(Math.random()*1E9).toString()+".pdf")
const options = {
    format:"A3",
    orientiation:"portrait",
    border:"10mm",
    header:{
        height:"45mm",
        contents:'<div style="text-align: center;">PDf from blog.io</div>'
    },
    footer:{
        heigth:"28mm",
        contents:{
            first:'Cover page',
            default:'<span style="color: #444;">blog.io</span>',
            last:'last page'
        }
    }
}
   try{
    const post =await Post.findById(postId).lean()
    
    const document={
        html,
        data:{
           post
        },
        path:downloadPath,
        type:'',

    }
    await pdf.create(document,options)
    res.download(downloadPath,(err)=>{
        if(err) throw err
        fileDelete(downloadPath)
    })
   }catch(err){
    console.log(err);
   }
}


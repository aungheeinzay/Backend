const Post = require("../models/post")
const mongoose =require("mongoose")
const { formatISO9075 } = require("date-fns");
const pdf = require("pdf-creator-node")
const fs = require("fs")
const path = require("path");
const { fileDelete } = require("../utils/fileDelete");

//queryPage * postperpage / totalpost
//1         * 3 =3        /14   true
//2         * 3 =6        /14   true
//3         * 3 =9        /14   true
//4         * 3 =12       /14   true  last 2
//5         * 3 =15       /14<15 false

let postPerPage = 6;
let page;
exports.renderHome=(req,res,next)=>{
page =+req.query.page || 1
let totalPost;  
    
const isLogin = req.session.isLogin ? true : false
Post.find().countDocuments().then((totalDocument)=>{
totalPost = totalDocument
return Post.find().select("title image_url description createdAt")
.populate("userId","email _id isPremium profile")
.skip((page-1)*postPerPage)
.limit(postPerPage)
.sort({createdAt:-1})

}).then((posts)=>{

       return res.render("home",{
        posts,
        isLogin,
        csrfToken:req.csrfToken(),
        account:req.user?.email,
        isNext:(page*postPerPage<totalPost)? true : false,
        isPre:(page!==1) ? true : false,
        nextpage:(page*postPerPage<totalPost)? page+1 : page,
        prepage:(page==1) ? page : page-1
    })
}).catch(
    (err)=>{
        console.log(err)
        const error = new Error("not post found")
        return next(error)
    })
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
        const isCurrentUser = (post.userId._id.toString()==req.user?._id.toString()) ? true : false
        console.log(isCurrentUser);
        
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
    format:"A4",
    orientiation:"portrait",
    border:"10mm",
    header:{
        height:"20mm",
        contents:'<div style="text-align: center;">PDf from blog.io</div>'
    },
    footer:{
        heigth:"15mm",
        contents:'<span style="color: #444;">blog.io</span>', 
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


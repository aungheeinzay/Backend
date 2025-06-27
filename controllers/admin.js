const Post = require("../models/post")
const {fileDelete} =require("../utils/fileDelete")
const {validationResult} = require("express-validator")

exports.createPost=(req,res)=>{
     const {title,image_url,description} = req.body
     const isLogin = req.session.isLogin ? true : false
     if(req.file===undefined){
           return res.status(422).render("createPost",{
            csrfToken:req.csrfToken(),
            errorMsg:"it must be jpg/jpeg/png",
            isLogin,
            failForm:{
                title,
                description,
                image_url
            }
        })
     }
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).render("createPost",{
            csrfToken:req.csrfToken(),
            isLogin,
            errorMsg:error.array()[0].msg,
            failForm:{
                title,
                description,
                image_url
            }
        })
    } 
    Post.create({
        title,
        description,
        image_url:req.file.path,
        userId:req.session.userInfo._id}).then((_)=>{
        res.redirect("/")
    }).catch(err=>console.log(err))
}

exports.renderCreatePost=(req,res)=>{
    const isLogin = req.session.isLogin ? true : false
    res.render("createPost",{
         csrfToken:req.csrfToken(),
         errorMsg:null,
         isLogin,
         failForm:{
                title:"",
                description:"",
                image_url:""
            }})
}

exports.renderEditPage=(req,res)=>{
    const {postId} =req.params
    Post.findById(postId).then((post)=>{
        res.render("edit",{
            post,
            errorMsg:null,
            csrfToken:req.csrfToken(),
            })
    }).catch((err)=>console.log(err))
}

exports.updatePost=(req,res)=>{
    const {postId,title,description} = req.body
    const error = validationResult(req)
    Post.findById(postId).then((post)=>{
        if(post.userId.toString() !== req.user._id.toString()){
            return res.redirect(`/detail/${postId}`)
        }
        if(!error.isEmpty()){
            return res.status(422).render("edit",{
                errorMsg:error.array()[0].msg,
                csrfToken:req.csrfToken(),
                post,
                failForm:{
                    title,
                    description
                }
            })
        }
        if( req.file?.mimetype =='image/jpeg' ||
            req.file?.mimetype =='image/jpg' ||
            req.file?.mimetype =='image/png'
          ){
        fileDelete(post.image_url);
        post.title=title
        post.image_url=req.file.path
        post.description=description
        return post.save()
        .then((_)=>{
        console.log("updated");
        res.redirect(`/detail/${postId}`)
    })
    }
    post.title = title,
    post.description=description
    return post.save().then((_)=>{
        res.redirect(`/detail/${postId}`)
    })
    }).catch(err=>console.log(err))
}

exports.deletePost=(req,res)=>{
    const {postId} = req.params
    Post.findById(postId).then((post)=>{
        if(!post){
            res.redirect(`detail/${postId}`)
        }
    fileDelete(post.image_url)
    return Post.deleteOne({_id:postId,userId:req.user._id})
    }).then((_)=>{
        console.log("deleted");
        res.redirect("/")
    }).catch(err=>console.log(err))
   

}

exports.renderProfile=(req,res)=>{
    const isLogin = req.session.isLogin ? true : false
    res.render("users/profile",{isLogin,csrfToken:req.csrfToken()})
}

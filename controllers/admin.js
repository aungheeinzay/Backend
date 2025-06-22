const Post = require("../models/post")
const {validationResult} = require("express-validator")
exports.createPost=(req,res)=>{
     const {title,image_url,description} = req.body
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).render("createPost",{
            csrfToken:req.csrfToken(),
            errorMsg:error.array()[0].msg,
            failForm:{
                title,
                description,
                image_url
            }
        })
    }
    Post.create({title,description,image_url,userId:req.session.userInfo._id}).then((_)=>{
        res.redirect("/")
    }).catch(err=>console.log(err))
}

exports.renderCreatePost=(req,res)=>{
    res.render("createPost",{
         csrfToken:req.csrfToken(),
         errorMsg:null,
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
    const {postId,title,description,image_url} = req.body
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
                    image_url,
                    description
                }
            })
        }
        post.title=title
        post.image_url=image_url
        post.description=description
        return post.save()
        .then((result)=>{
        console.log("updated");
        res.redirect(`/detail/${postId}`)
    })
    }).catch(err=>console.log(err))
}

exports.deletePost=(req,res)=>{
    const {postId} = req.params
    
    Post.deleteOne({_id:postId,userId:req.user._id}).then((_)=>{
        console.log("deleted");
        res.redirect("/")
    }).catch(err=>console.log(err))

}

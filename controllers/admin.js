const Post = require("../models/post")

exports.createPost=(req,res)=>{
    const {title,image_url,description} = req.body
    Post.create({title,description,image_url,userId:req.session.userInfo._id}).then((_)=>{
        res.redirect("/")
    }).catch(err=>console.log(err))
}

exports.renderCreatePost=(req,res)=>{
    res.render("createPost",{csrfToken:req.csrfToken()})
}

exports.renderEditPage=(req,res)=>{
    const {postId} =req.params
    Post.findById(postId).then((post)=>{
        res.render("edit",{post,csrfToken:req.csrfToken()})
    }).catch((err)=>console.log(err))
}

exports.updatePost=(req,res)=>{
    const {postId,title,description,image_url} = req.body
    Post.findById(postId).then((post)=>{
        if(post.userId.toString() !== req.user._id){
            return res.redirect(`/detail/${postId}`)
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

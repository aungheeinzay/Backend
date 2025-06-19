const Post = require("../models/post")

exports.createPost=(req,res)=>{
    const {title,image_url,description} = req.body
    Post.create({title,description,image_url}).then((post)=>{
        console.log(post);
        res.redirect("/")
    }).catch(err=>console.log(err))
}

exports.renderCreatePost=(req,res)=>{
    res.render("createPost")
}

exports.renderEditPage=(req,res)=>{
    const {postId} =req.params
    Post.findById(postId).then((post)=>{
        res.render("edit",{post})
    }).catch((err)=>console.log(err))
}

exports.updatePost=(req,res)=>{
    const {postId,title,description,image_url} = req.body
    Post.findById(postId).then((post)=>{
        post.title=title
        post.image_url=image_url
        post.description=description
        return post.save()
    }).then((result)=>{
        console.log("updated");
        res.redirect(`/detail/${postId}`)
    }).catch(err=>console.log(err))
}

exports.deletePost=(req,res)=>{
    const {postId} = req.params
    
    Post.findByIdAndDelete(postId).then((_)=>{
        console.log("deleted");
        res.redirect("/")
    }).catch(err=>console.log(err))

}
const Post = require("../models/post")


exports.renderHome=async(req,res)=>{
try{const posts = await Post.getPosts()
console.log(posts);
res.render("home",{posts})}catch(err){
    console.log(err);
    
}
}
exports.renderCreatePost=(req,res)=>{
    res.render("createPost")
}
exports.renderDetail=async(req,res)=>{
    const {postId} =req.params;
    try{
        const post = await Post.getPost(postId)
        res.render("details",{post})
    }catch(err){
        console.log(err);
        
    }
}
exports.createPost=(req,res)=>{
    const {title,image_url,description} = req.body
    const post = new Post(title,image_url,description)
    post.create().then((result)=>{
        console.log(result);
        res.redirect("/")
    }).catch(err=>console.log(err))
}
exports.deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        await Post.deletePost(postId);
        res.redirect("/"); 
    } catch(err) {
        console.log(err);
    }
}

exports.renderEditPage=async(req,res)=>{
    const {postId} = req.params
    try{
        const post=await Post.getPost(postId)
        res.render("edit",{post})
    }catch(err){
        console.log(err);
        
    }
}
exports.updatePost=async(req,res)=>{
    const{postId} =req.params
    const{title,image_url,description} =req.body
    try{
        await Post.updatePost(postId,{
            title,
            image_url,
            description
        })
        res.redirect(`/detail/${postId}`)
    }catch(err){
        console.log(err);
        
    }
}
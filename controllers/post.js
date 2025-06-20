const Post = require("../models/post")
const mongoose =require("mongoose")

exports.renderHome=async(req,res)=>{
Post.find().select("title").populate("userId","username")
.sort({title:-1}).then((posts)=>{
    console.log(posts);
    
    res.render("home",{posts})
}).catch(err=>console.log(err))
}

exports.renderDetail=async(req,res)=>{
    try{
        const {postId} =req.params;
    // if(!mongoose.Types.ObjectId.isValid(postId)){
    //     return res.status(400).send("Invilid post Id")
    // }
       const post = await Post.findById(postId)
    //    if(!post){
    //     res.status(404).send("post is not found")
    // //    }
        res.render("details",{post})}catch(err){
        console.log(err);
            
        }
}


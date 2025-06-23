const Post = require("../models/post")
const mongoose =require("mongoose")
const { formatISO9075 } = require("date-fns");
exports.renderHome=async(req,res)=>{
const isLogin = req.session.isLogin ? true : false
Post.find().select("title createdAt").populate("userId","username")
.sort({createdAt:-1}).then((posts)=>{

    res.render("home",{posts,isLogin,csrfToken:req.csrfToken(),account:req.user?.email})
}).catch(err=>console.log(err))
}

exports.renderDetail=async(req,res,next)=>{
    try{
        const {postId} =req.params;
    // if(!mongoose.Types.ObjectId.isValid(postId)){
    //     return res.status(400).send("Invilid post Id")
    // }
       const post = await Post.findById(postId)
    //    if(!post){
    //     res.status(404).send("post is not found")
    // //    }
        const isCurrentUser = (post.userId.toString()==req.user?._id) ? true : false
        res.render("details",{
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


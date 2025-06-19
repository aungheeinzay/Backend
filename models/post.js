const{getDatabase} = require("../utils/database")
const mongodb = require("mongodb")
class Post {
    constructor(title,image_url,description){
        this.title = title
        this.image_url = image_url
        this.description = description
    }
    create(){
        const db = getDatabase()
        return db.collection("post").insertOne(this)
        .then((_)=>{
         }).catch(err=>console.log(err))
    }
    static getPosts(){
        const db = getDatabase()
        return db.collection("post").find().toArray()
        .then((posts)=>{
            return posts
        }).catch(err=>console.log(err))
    }
    static getPost(postId){
         const db = getDatabase()
        return db.collection("post").find({_id:new mongodb.ObjectId(postId)}).next()
        .then((post)=>{
            return post
        }).catch(err=>console.log(err))
    }
   static deletePost(postId){
    const db = getDatabase();
    return db.collection("post")
        .deleteOne({ _id: new mongodb.ObjectId(postId) })
        .then(result => {
            return { success: true };
        })
        .catch(err => {
            console.log(err);
        });
}
    static updatePost(postId,updateData){
        const db = getDatabase()
        return db.collection("post").updateOne({
            _id:new mongodb.ObjectId(postId)
        },{
            $set:updateData
        }).then((result)=>{
            return result
        }).catch(err=>console.log(err))
    }
    
}

module.exports = Post
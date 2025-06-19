const mongodb = require("mongodb")
const dotenv = require("dotenv").config()
const mongodbClient= mongodb.MongoClient
let db;
const mongodbConnector = ()=>{
    mongodbClient.connect(process.env.MONGODB_URL)
.then((result)=>{
    console.log("connected to mongodb");
    db = result.db()
    
}
).catch(err=>console.log(err)
)
}
const getDatabase =()=>{
    if(db){
        return db
    }
    throw "No database"
}
module.exports = {mongodbConnector,getDatabase};
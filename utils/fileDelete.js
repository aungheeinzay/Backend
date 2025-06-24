const fs = require("fs")

exports.fileDelete = (path) =>{
    fs.unlink(path,(err)=>{
        if(err)throw err
        console.log("photo was deleted");
        
    })
}

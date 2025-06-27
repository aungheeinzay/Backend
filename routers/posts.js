const express = require("express")
const router = express.Router()
const postController = require("../controllers/post")
const userController = require("../controllers/user")
router.get("/",postController.renderHome)
router.get("/detail/:postId",postController.renderDetail)
router.get("/save/:postId",postController.savePostAsPDF)
router.get("/profile/:userId",userController.renderPublicProfile)
//post method

module.exports = router
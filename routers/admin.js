const express = require("express")
const router = express.Router()
const adminController = require("../controllers/admin")
router.get("/edit/:postId",adminController.renderEditPage)
router.get("/createPost",adminController.renderCreatePost)
//post method
router.post("/createPost",adminController.createPost)
router.post("/edit/:postId",adminController.updatePost)
router.post("/delete/:postId",adminController.deletePost)
module.exports = router;
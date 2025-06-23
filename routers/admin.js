const express = require("express")
const router = express.Router()
const adminController = require("../controllers/admin")
const {body} = require("express-validator")
router.get("/edit/:postId",adminController.renderEditPage)
router.get("/createPost",adminController.renderCreatePost)
//post method
router.post("/createPost",
body("title")
.isLength({min:1})
.withMessage("need to add title")
,adminController.createPost)
router.post("/edit/:postId",adminController.updatePost)
router.post("/delete/:postId",adminController.deletePost)
module.exports = router;
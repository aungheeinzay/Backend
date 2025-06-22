const express = require("express")
const router = express.Router()
const adminController = require("../controllers/admin")
const {body} = require("express-validator")
router.get("/edit/:postId",adminController.renderEditPage)
router.get("/createPost",adminController.renderCreatePost)
//post method
router.post("/createPost",
[body("title")
.isLength({min:1}),
body("image_url")
.isURL()
.withMessage("it must be image url")
],adminController.createPost)
router.post("/edit/:postId",
body("image_url")
.isURL()
.withMessage("it must be image url"),adminController.updatePost)
router.post("/delete/:postId",adminController.deletePost)
module.exports = router;
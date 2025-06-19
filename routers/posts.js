const express = require("express")
const router = express.Router()
const postController = require("../controllers/post")

router.get("/",postController.renderHome)
router.get("/detail/:postId",postController.renderDetail)
router.get("/detail/edit/:postId",postController.renderEditPage)

//post method
router.post("/createPost",postController.createPost)
router.post("/detail/delete/:postId",postController.deletePost)
router.post("/edit/:postId",postController.updatePost)
module.exports = router
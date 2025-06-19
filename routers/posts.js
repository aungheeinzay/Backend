const express = require("express")
const router = express.Router()
const postController = require("../controllers/post")

router.get("/",postController.renderHome)
router.get("/detail/:postId",postController.renderDetail)


//post method

module.exports = router
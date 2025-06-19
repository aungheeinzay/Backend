const express = require("express")
const router = express.Router()
const adminController = require("../controllers/post")

router.get("/createPost",adminController.renderCreatePost)

module.exports = router;
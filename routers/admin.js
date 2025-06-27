const express = require("express")
const router = express.Router()
const adminController = require("../controllers/admin")
const userController = require("../controllers/user")
const {body} = require("express-validator")
router.get("/edit/:postId",adminController.renderEditPage)
router.get("/createPost",adminController.renderCreatePost)
router.get("/profile",userController.renderProfile)
router.get("/profile/edit/:userId",userController.renderEditInfo)
router.get("/premium",userController.renderPremium)
router.get("/subscription-success",userController.renderSuccess)
router.get("/checkPremiumStatus/:payment_session_key",userController.premiumStatus)
router.get("/subscription-cancel",userController.subscription_cancel)
//post method
router.post("/createPost",
body("title")
.isLength({min:1})
.withMessage("need to add title")
,adminController.createPost)
router.post("/edit/:postId",adminController.updatePost)
router.post("/delete/:postId",adminController.deletePost)
router.post("/profile/edit/:userId",
body("email")
.isEmail()
.withMessage("please enter correct email"),
userController.updateProfile)
module.exports = router;
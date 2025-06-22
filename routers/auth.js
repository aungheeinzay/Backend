const express = require("express")
const router = express.Router()
const {body} = require("express-validator")
const authController = require("../controllers/auth")
const User = require("../models/user")


router.post("/logout",authController.Logout)
router.get("/login",authController.renderLogin)
router.post("/login",
body("email")
.isEmail()
.withMessage("enter correct email"),
body("password")
.isLength({min:4})
.trim()
.withMessage("email or password wrong"),authController.postLogin)
router.get("/register",authController.renderRegister)
router.post("/register",
body("email")
.isEmail()
.withMessage("enter correct email")
.custom((value,{req})=>{
 return User.findOne({email:value}).then((user)=>{
    if(user){
        return Promise.reject("email already exit")
    }
 })
}),
body("password")
.isLength({min:4})
.trim().withMessage("password must have at least 4characters")
,authController.register)
router.get("/reset_password",authController.renderReset)
router.post('/reset_password',
body("email")
.isEmail()
.withMessage("enter correct email")
.custom((value,{req})=>{
   return User.findOne({email:value}).then((user)=>{
       if(!user){
         return Promise.reject("no account exit")
       }
    })
}),authController.resetLink)
router.get("/feedBack",authController.feedBack)
router.get("/reset_password/:token",authController.getResetForm)
router.post("/reset_password/:token",
body("newPassword")
.isLength({min:4})
.trim()
.withMessage("password must have at least 4characters"),
body("conformPassword")
.trim()
.custom((value,{req})=>{
    if(value !== req.body.newPassword){
        throw new Error("password must match")
    }
    return true
}),authController.resetForm)
module.exports = router
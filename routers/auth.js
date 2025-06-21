const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth")

router.post("/logout",authController.Logout)
router.get("/login",authController.renderLogin)
router.post("/login",authController.postLogin)
router.get("/register",authController.renderRegister)
router.post("/register",authController.register)
module.exports = router
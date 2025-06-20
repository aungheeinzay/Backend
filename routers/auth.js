const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth")

router.post("/logout",authController.Logout)
router.get("/login",authController.renderLogin)
router.post("/login",authController.postLogin)

module.exports = router
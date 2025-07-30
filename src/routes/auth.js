const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/email/send", authController.sendVerificationCode);
router.post("/email/verify", authController.confirmCode);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

router.put("/password", authenticate, userController.changePassword);

module.exports = router;

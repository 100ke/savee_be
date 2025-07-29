const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const {
  authenticate,
  checkBlacklist,
} = require("../middlewares/authMiddleware");

router.put(
  "/password",
  authenticate,
  checkBlacklist,
  userController.changePassword
);
router.put("/name", authenticate, checkBlacklist, userController.changeName);

module.exports = router;

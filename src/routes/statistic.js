const express = require("express");
const router = express.Router();
const statisticController = require("../controllers/statisticController");
const { authenticate } = require("../middlewares/authMiddleware");

router.get(
  "/categories",
  authenticate,
  statisticController.getCategoryExpensing
);

module.exports = router;

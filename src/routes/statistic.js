const express = require("express");
const router = express.Router();
const statisticController = require("../controllers/statisticController");
const { authenticate } = require("../middlewares/authMiddleware");
const { checkPersonalLedger } = require("../middlewares/statisticMiddleware");

router.get(
  "/categories",
  authenticate,
  checkPersonalLedger,
  statisticController.getCategoryExpensing
);

router.get(
  "/trend/total-month",
  authenticate,
  checkPersonalLedger,
  statisticController.getMonthlyTotalExpensing
);
router.get(
  "/trend/total-week",
  authenticate,
  checkPersonalLedger,
  statisticController.getWeeklyTotalExpensing
);

module.exports = router;

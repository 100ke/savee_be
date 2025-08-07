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
  "/trend/total/monthly",
  authenticate,
  checkPersonalLedger,
  statisticController.getMonthlyTotalExpensing
);
router.get(
  "/trend/total/weekly",
  authenticate,
  checkPersonalLedger,
  statisticController.getWeeklyTotalExpensing
);

router.get(
  "/trend/daily",
  authenticate,
  checkPersonalLedger,
  statisticController.getLast7DaysExpensing
);

module.exports = router;

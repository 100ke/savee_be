const express = require("express");
// 상위 라우터에서 하위 라우터로 파라미터 받아오기 : ledgerId
const router = express.Router({ mergeParams: true });
const transactionController = require("../controllers/transactionController");
const { authenticate } = require("../middlewares/authMiddleware");

// 일일 가계부 거래 내역
router.get(
  "/monthly",
  authenticate,
  transactionController.getMonthlyTransactions
);

// 주간 가계부 총수입/지출
router.get(
  "/weekly",
  authenticate,
  transactionController.getWeeklyTransactions
);

router.post("/", authenticate, transactionController.addTransactions);
router.get("/", authenticate, transactionController.getTransactions);
router.get(
  "/:transactionId",
  authenticate,
  transactionController.findTransaction
);
router.put(
  "/:transactionId",
  authenticate,
  transactionController.updateTransaction
);
router.delete(
  "/:transactionId",
  authenticate,
  transactionController.deleteTransaction
);

module.exports = router;

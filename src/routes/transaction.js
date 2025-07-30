const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { authenticate } = require("../middlewares/authMiddleware");

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

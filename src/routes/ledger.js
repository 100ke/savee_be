const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerController");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/", authenticate, ledgerController.createLedger);
router.put("/:ledgerId", authenticate, ledgerController.updateLedger);
router.get("/", authenticate, ledgerController.getLedgers);
router.delete("/:ledgerId", authenticate, ledgerController.deleteLedger);
router.get("/:ledgerId", authenticate, ledgerController.findLedger);

module.exports = router;

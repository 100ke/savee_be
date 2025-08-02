const express = require("express");
const router = express.Router({ mergeParams: true });
const ledgerMemberController = require("../controllers/ledgerController");
const inviteController = require("../controllers/inviteController");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/", authenticate, inviteController.createInvites);

module.exports = router;

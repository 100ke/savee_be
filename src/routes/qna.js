const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const qnaController = require("../controllers/qnaController");

router.post("/", authenticate, qnaController.createQna);
router.put("/:id", authenticate, qnaController.updateQna);
router.delete("/:id", authenticate, qnaController.deleteQna);

router.get("/", authenticate, qnaController.findAllQna);
router.get("/search", authenticate, qnaController.findQnaByName);
module.exports = router;

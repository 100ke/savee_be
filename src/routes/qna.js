const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const postController = require("../controllers/postController");

router.post("/", authenticate, postController.createPost);
router.put("/:id", authenticate, postController.updatePost);
router.delete("/:id", authenticate, postController.deletePost);

router.get("/", authenticate,postController.findAllPost);
router.get("/:keyword", authenticate,postController.findPostByName);
module.exports = router;

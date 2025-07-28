const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const postController = require("../controllers/supportPost");

router.post("/", authenticate, postController.createPost);
router.get("/", postController.findAllPost);
router.put("/:id", authenticate, onlyStore, postController.updatePost);
router.delete("/:id", authenticate, onlyStore, postController.deletePost);
router.get("/:keyword", postController.findPostByName);
module.exports = router;

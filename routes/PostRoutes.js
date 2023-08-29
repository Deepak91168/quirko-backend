const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
router.post("/create-post", authMiddleware, createPost);
router.get("/get-post", authMiddleware, getPosts);
router.put("/update-post/:id", authMiddleware, updatePost);
router.delete("/delete-post/:id", authMiddleware, deletePost);
module.exports = router;

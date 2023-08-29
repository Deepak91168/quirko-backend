const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  userProfile,
  updateUserProfile,
  updateProfilePicture,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, userProfile);
router.put("/updateProfile", authMiddleware, updateUserProfile);
router.put("/updateProfilePicture", authMiddleware, updateProfilePicture);
module.exports = router;

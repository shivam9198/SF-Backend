const express = require("express");
const router = express.Router();
const {
  registerStaff,
  registerInitialAdmin,
  login,
  getCurrentUser,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", login);
router.post("/register-admin", registerInitialAdmin);

// Admin only routes
router.post("/register-staff", protect, authorize("admin"), registerStaff);

// Protected routes
router.get("/me", protect, getCurrentUser);

module.exports = router;

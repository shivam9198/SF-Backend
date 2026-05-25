const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

// Admin-only routes
router.get("/", authorize("admin"), getAllUsers);
router.post("/", authorize("admin"), createUser);
router.delete("/:id", authorize("admin"), deleteUser);

// Admin or own-user routes
router.get("/:id", getUserById);
router.put("/:id", updateUser);

module.exports = router;

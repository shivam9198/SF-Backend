const express = require("express");
const router = express.Router();
const {
  getAllStaff,
  getStaffById,
  updateStaff,
  updateStaffStatus,
} = require("../controllers/staffController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getAllStaff);
router.get("/:id", getStaffById);
router.put("/:id", updateStaff);
router.patch("/:id/status", updateStaffStatus);

module.exports = router;

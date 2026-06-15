const express = require("express");
const router = express.Router();
const { getEmiSchedule, payEmi } = require("../controllers/emiController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:loanId", protect, getEmiSchedule);
router.patch("/:installmentId/pay", protect, payEmi);

module.exports = router;

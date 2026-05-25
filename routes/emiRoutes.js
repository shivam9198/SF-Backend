const express = require("express");
const router = express.Router();
const { getEmiSchedule } = require("../controllers/emiController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:loanId", protect, getEmiSchedule);

module.exports = router;

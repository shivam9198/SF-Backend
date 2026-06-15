const express = require("express");
const router = express.Router();
const {
  createLoan,
  getLoans,
  getLoanById,
  getLoanInstallments,
} = require("../controllers/loanController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createLoan);
router.get("/", protect, getLoans);
router.get("/:id", protect, getLoanById);
router.get("/:loanId/installments", protect, getLoanInstallments);

module.exports = router;

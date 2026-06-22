const mongoose = require("mongoose");
const EMI = require("../models/EMI");

const getEmiSchedule = async (req, res, next) => {
  try {
    const { loanId } = req.params;

    if (!loanId || !mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).json({ message: "Valid loanId is required" });
    }

    const emis = await EMI.find({ loanId })
      .populate("customerId", "fullName phone customerCode")
      .populate("collectedBy", "name role")
      .sort({ emiNumber: 1 });
    res.status(200).json({ loanId, schedule: emis });
  } catch (error) {
    next(error);
  }
};

const payEmi = async (req, res, next) => {
  try {
    const { installmentId } = req.params;
    const { paymentMode } = req.body;

    if (!installmentId || !mongoose.Types.ObjectId.isValid(installmentId)) {
      return res.status(400).json({ message: "Valid installmentId is required" });
    }

    const validModes = ["Cash", "UPI", "Bank Transfer"];
    let modeToSave = "Cash"; // default or as per request
    if (paymentMode && validModes.includes(paymentMode)) {
      modeToSave = paymentMode;
    } else if (paymentMode) {
      return res.status(400).json({ message: "Invalid payment mode. Must be Cash, UPI, or Bank Transfer" });
    }

    const installment = await EMI.findById(installmentId);

    if (!installment) {
      return res.status(404).json({ message: "Installment not found" });
    }

    if (installment.status === "Paid") {
      return res.status(400).json({ message: "Installment already paid" });
    }

    installment.status = "Paid";
    installment.paidOn = new Date();
    installment.collectedBy = req.user.id;
    if (paymentMode) {
        installment.paymentMode = modeToSave;
    }

    await installment.save();
    await installment.populate("customerId", "fullName phone customerCode");
    await installment.populate("collectedBy", "name role");

    res.status(200).json({
      message: "Installment marked as paid",
      installment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmiSchedule,
  payEmi,
};

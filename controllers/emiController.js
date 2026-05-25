const mongoose = require("mongoose");
const EMI = require("../models/EMI");

const getEmiSchedule = async (req, res, next) => {
  try {
    const { loanId } = req.params;

    if (!loanId || !mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).json({ message: "Valid loanId is required" });
    }

    const emis = await EMI.find({ loanId }).sort({ emiNumber: 1 });
    res.status(200).json({ loanId, schedule: emis });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmiSchedule,
};

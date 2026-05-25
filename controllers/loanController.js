const mongoose = require("mongoose");
const Loan = require("../models/Loan");
const EMI = require("../models/EMI");
const Customer = require("../models/Customer");

const addMonths = (date, months) => {
  const result = new Date(date);
  const day = result.getDate();
  result.setMonth(result.getMonth() + months);
  if (result.getDate() !== day) {
    result.setDate(0);
  }
  return result;
};

const createLoan = async (req, res, next) => {
  try {
    const {
      customerId,
      productName,
      imeiNumber,
      productPrice,
      loginCharge,
      downPayment,
      emiPlan,
      purchaseDate,
    } = req.body;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Valid customerId is required" });
    }

    if (!productName || !imeiNumber) {
      return res
        .status(400)
        .json({ message: "Product name and IMEI number are required" });
    }

    if (productPrice == null || isNaN(productPrice) || productPrice < 0) {
      return res
        .status(400)
        .json({ message: "Valid productPrice is required" });
    }

    if (downPayment == null || isNaN(downPayment) || downPayment < 0) {
      return res.status(400).json({ message: "Valid downPayment is required" });
    }

    const plan = Number(emiPlan);
    if (![6, 8, 12].includes(plan)) {
      return res
        .status(400)
        .json({ message: "emiPlan must be one of 6, 8, or 12" });
    }

    if (purchaseDate) {
      const date = new Date(purchaseDate);
      if (Number.isNaN(date.getTime())) {
        return res
          .status(400)
          .json({ message: "Valid purchaseDate is required" });
      }
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const charge =
      loginCharge == null || isNaN(loginCharge) ? 500 : Number(loginCharge);
    if (charge < 0) {
      return res.status(400).json({ message: "Valid loginCharge is required" });
    }

    if (Number(downPayment) > Number(productPrice)) {
      return res
        .status(400)
        .json({ message: "Down payment cannot exceed product price" });
    }

    const loanAmount =
      Number(productPrice) - Number(downPayment) + Number(charge);
    const monthlyEmi = Number((loanAmount / plan).toFixed(2));

    const purchase = purchaseDate ? new Date(purchaseDate) : new Date();
    const loan = new Loan({
      customerId,
      productName: productName.trim(),
      imeiNumber: imeiNumber.trim(),
      productPrice: Number(productPrice),
      loginCharge: charge,
      downPayment: Number(downPayment),
      loanAmount,
      emiPlan: plan,
      monthlyEmi,
      purchaseDate: purchase,
      createdBy: req.user.id,
    });

    await loan.save();

    const firstDueDate = addMonths(purchase, 1);
    const schedule = Array.from({ length: plan }, (_, index) => ({
      loanId: loan._id,
      customerId,
      emiNumber: index + 1,
      dueDate: addMonths(firstDueDate, index),
      amount: monthlyEmi,
      status: "Pending",
      paidOn: null,
      collectedBy: null,
    }));

    await EMI.insertMany(schedule);

    res.status(201).json({
      message: "Loan created successfully",
      loan: {
        id: loan._id,
        customerId: loan.customerId,
        productName: loan.productName,
        imeiNumber: loan.imeiNumber,
        productPrice: loan.productPrice,
        loginCharge: loan.loginCharge,
        downPayment: loan.downPayment,
        loanAmount: loan.loanAmount,
        emiPlan: loan.emiPlan,
        monthlyEmi: loan.monthlyEmi,
        purchaseDate: loan.purchaseDate,
        createdBy: loan.createdBy,
      },
      installmentsCreated: plan,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const getLoans = async (req, res, next) => {
  try {
    const { search, customerId } = req.query;
    const filter = {};

    if (customerId) {
      if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return res
          .status(400)
          .json({ message: "Valid customerId is required" });
      }
      filter.customerId = customerId;
    }

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ productName: regex }, { imeiNumber: regex }];
    }

    const loans = await Loan.find(filter)
      .populate("customerId", "fullName phone")
      .sort({ createdAt: -1 });

    res.status(200).json(loans);
  } catch (error) {
    next(error);
  }
};

const getLoanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Valid loan id is required" });
    }

    const loan = await Loan.findById(id).populate(
      "customerId",
      "fullName phone",
    );
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json(loan);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLoan,
  getLoans,
  getLoanById,
};

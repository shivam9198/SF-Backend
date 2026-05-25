const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer ID is required"],
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    imeiNumber: {
      type: String,
      required: [true, "IMEI number is required"],
      trim: true,
    },
    productPrice: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price must be at least 0"],
    },
    loginCharge: {
      type: Number,
      default: 500,
      min: [0, "Login charge must be at least 0"],
    },
    downPayment: {
      type: Number,
      required: [true, "Down payment is required"],
      min: [0, "Down payment must be at least 0"],
    },
    loanAmount: {
      type: Number,
      required: true,
      min: [0, "Loan amount must be at least 0"],
    },
    emiPlan: {
      type: Number,
      required: [true, "EMI plan is required"],
      enum: {
        values: [6, 8, 12],
        message: "EMI plan must be 6, 8, or 12 months",
      },
    },
    monthlyEmi: {
      type: Number,
      required: true,
      min: [0, "Monthly EMI must be at least 0"],
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "CreatedBy is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;

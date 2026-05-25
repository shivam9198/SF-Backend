const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  { _id: false },
);

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    alternatePhone: {
      type: String,
      trim: true,
      default: null,
    },
    aadhaar: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return !value || /^XXXX-XXXX-\d{4}$/.test(value);
        },
        message: "Aadhaar must be stored in masked format like XXXX-XXXX-1234",
      },
    },
    address: {
      type: addressSchema,
      default: {},
    },
    kycDocumentType: {
      type: String,
      enum: ["Aadhaar", "Voter ID", "DL"],
      default: "Aadhaar",
    },
    kycDocumentImage: {
      type: String,
      trim: true,
      default: null,
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

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;

const mongoose = require("mongoose");
const Customer = require("../models/Customer");

const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return null;
  const digits = aadhaar.replace(/\D/g, "");
  if (digits.length < 4) return aadhaar;
  return `XXXX-XXXX-${digits.slice(-4)}`;
};

const normalizeKycDocumentType = (type) => {
  if (!type) return undefined;
  const map = {
    "Aadhaar Card": "Aadhaar",
    Aadhaar: "Aadhaar",
    "Voter ID": "Voter ID",
    DL: "DL",
    "Driver License": "DL",
    "Driving License": "DL",
  };
  return map[type] || type;
};

const createCustomer = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      alternatePhone,
      aadhaar,
      address,
      kycDocumentType,
      kycDocumentImage,
    } = req.body;

    if (!fullName || !phone) {
      return res
        .status(400)
        .json({ message: "fullName and phone are required" });
    }

    const existing = await Customer.findOne({ phone });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Customer with this phone already exists" });
    }

    const addressPayload =
      typeof address === "string" ? { street: address } : address || {};
    const normalizedKycDocumentType = normalizeKycDocumentType(kycDocumentType);

    const customer = new Customer({
      fullName: fullName.trim(),
      phone: phone.trim(),
      alternatePhone: alternatePhone ? alternatePhone.trim() : undefined,
      aadhaar: maskAadhaar(aadhaar),
      address: addressPayload,
      kycDocumentType: normalizedKycDocumentType,
      kycDocumentImage,
      createdBy: req.user.id,
    });

    await customer.save();

    res
      .status(201)
      .json({ message: "Customer created successfully", customer });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "Customer phone must be unique" });
    }
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ fullName: regex }, { phone: regex }];
    }

    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates.createdBy;
    delete updates._id;

    if (updates.aadhaar) {
      updates.aadhaar = maskAadhaar(updates.aadhaar);
    }

    if (updates.address && typeof updates.address === "string") {
      updates.address = { street: updates.address };
    }
    if (updates.kycDocumentType) {
      updates.kycDocumentType = normalizeKycDocumentType(
        updates.kycDocumentType,
      );
    }

    if (updates.phone) {
      updates.phone = updates.phone.trim();
    }
    if (updates.fullName) {
      updates.fullName = updates.fullName.trim();
    }
    if (updates.alternatePhone) {
      updates.alternatePhone = updates.alternatePhone.trim();
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Customer updated successfully", customer });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "Customer phone must be unique" });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    next(error);
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};

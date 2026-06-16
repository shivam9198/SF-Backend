const User = require("../models/User");

// Get all staff and admin users
const getAllStaff = async (req, res, next) => {
  try {
    const staff = await User.find({ role: { $in: ["admin", "staff"] } })
      .select("-password");
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
};

// Get staff by ID
const getStaffById = async (req, res, next) => {
  try {
    const staff = await User.findById(req.params.id).select("-password");
    
    if (!staff || (staff.role !== "admin" && staff.role !== "staff")) {
      return res.status(404).json({ message: "Staff not found" });
    }
    
    res.status(200).json(staff);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Staff not found" });
    }
    next(error);
  }
};

// Update staff
const updateStaff = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body;
    
    // Prevent duplicate email
    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }
    
    // Prevent duplicate phone
    if (phone) {
      const existingPhone = await User.findOne({ phone, _id: { $ne: req.params.id } });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already in use" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({
      message: "Staff updated successfully",
      user
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Staff not found" });
    }
    next(error);
  }
};

// Activate / Deactivate staff
const updateStaffStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (status !== "active" && status !== "inactive") {
      return res.status(400).json({ message: "Invalid status value. Use 'active' or 'inactive'." });
    }

    const isActive = status === "active";

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({
      message: "Status updated successfully"
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Staff not found" });
    }
    next(error);
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  updateStaff,
  updateStaffStatus
};

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api/emis", require("./routes/emiRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Error handling middleware
app.use(errorHandler);

module.exports = app;

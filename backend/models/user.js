const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Technician", "Team Leader", "Supervisor"],
    },
    shop: { type: String, required: true },
  },
  { timestamps: true },
);

const Users = mongoose.model("users", userSchema);

module.exports = Users;

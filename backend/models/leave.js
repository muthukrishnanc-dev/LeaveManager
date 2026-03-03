const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      requied: true,
      unique: true,
    },
    startDate: { type: Date, required: [true, "You must provide start date"] },
    endDate: { type: Date, required: [true, "You must provide end date"] },
    reason: { type: String, required: true },
    totalLeave: { type: Number, default: 31 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Leave", leaveSchema);

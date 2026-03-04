const mongoose = require("mongoose");
const Technicians = require("../models/technician");
const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    startDate: { type: Date, required: [true, "You must provide start date"] },
    endDate: { type: Date, required: [true, "You must provide end date"] },
    reason: { type: String, required: true },
    totalLeave: { type: Number, default: 31 },
  },
  { timestamps: true },
);

leaveSchema.pre("save", async function () {
  const leaveLimits = {
    RN_EMPLOYEE: 32,
    NAPS: 12,
    CL: 12,
  };
  const technician = await Technicians.findOne({ userId: this.userId });
  this.totalLeave = leaveLimits[technician.designation] || 32;
});

module.exports = mongoose.model("Leave", leaveSchema);

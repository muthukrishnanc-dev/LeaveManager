const { Schema, model, default: mongoose } = require("mongoose");

const technicianSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      requied: true,
      unique: true,
    },
    zone: { type: String, required: true },
    section: { type: String, required: true },
    area: { type: String, enum: ["RH", "LH", "BOTH"], required: true },
    designation: {
      type: String,
      enum: ["RN_EMPLOYEE", "NAPS", "CL"],
      required: true,
    },
  },

  { timestamps: true },
);

const Technicians = model("technicians", technicianSchema);

module.exports = Technicians;

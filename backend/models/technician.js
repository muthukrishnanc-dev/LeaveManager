const { Schema,model } = require("mongoose");

const technicianSchema = new Schema(
  {
    zone: { type: String, required: true },
    section: { type: String, required: true },
    area: { type: String, enum: ["RH", "LH", "BOTH"], required: true },
    designation: {
      type: String,
      enum: ["RN_EMPLOYEE", "NAPS", "CL"],
      required: true,
        },
    leave:{type:Number,default:1}
    },
  
  { timestamps: true },
);

const Technicians = model("technicians", technicianSchema);

module.exports = Technicians;
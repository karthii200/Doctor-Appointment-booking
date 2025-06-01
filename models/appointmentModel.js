import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorInfo: {
      type: Object, // Better data storage
      required: true,
    },
    userInfo: {
      type: Object, // Better data storage
      required: true,
    },
    date: {
      type: Date, // ✅ Use Date type for accurate date handling
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    time: {
      type: Date, // ✅ Use Date type for accurate time handling
      required: true,
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);

export default appointmentModel;

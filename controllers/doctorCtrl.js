// const appointmentModel = require("../models/appointmentModel");
// const doctorModel = require("../models/doctorModel");
// const userModel = require("../models/userModels");
// const getDoctorInfoController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findOne({ userId: req.body.userId });
//     res.status(200).send({
//       success: true,
//       message: "doctor data fetch success",
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Fetching Doctor Details",
//     });
//   }
// };

// // update doc profile
// const updateProfileController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findOneAndUpdate(
//       { userId: req.body.userId },
//       req.body
//     );
//     res.status(201).send({
//       success: true,
//       message: "Doctor Profile Updated",
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Doctor Profile Update issue",
//       error,
//     });
//   }
// };

// //get single docotor
// const getDoctorByIdController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
//     res.status(200).send({
//       success: true,
//       message: "Sigle Doc Info Fetched",
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Erro in Single docot info",
//     });
//   }
// };

// const doctorAppointmentsController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findOne({ userId: req.body.userId });
//     const appointments = await appointmentModel.find({
//       doctorId: doctor._id,
//     });
//     res.status(200).send({
//       success: true,
//       message: "Doctor Appointments fetch Successfully",
//       data: appointments,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Doc Appointments",
//     });
//   }
// };

// const updateStatusController = async (req, res) => {
//   try {
//     const { appointmentsId, status } = req.body;
//     const appointments = await appointmentModel.findByIdAndUpdate(
//       appointmentsId,
//       { status }
//     );
//     const user = await userModel.findOne({ _id: appointments.userId });
//     const notifcation = user.notifcation;
//     notifcation.push({
//       type: "status-updated",
//       message: `your appointment has been updated ${status}`,
//       onCLickPath: "/doctor-appointments",
//     });
//     await user.save();
//     res.status(200).send({
//       success: true,
//       message: "Appointment Status Updated",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error In Update Status",
//     });
//   }
// };

// module.exports = {
//   getDoctorInfoController,
//   updateProfileController,
//   getDoctorByIdController,
//   doctorAppointmentsController,
//   updateStatusController,
// };
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModels.js";

export const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching doctor details",
    });
  }
};

// ✅ Update doctor profile
export const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );
    res.status(201).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Doctor profile update issue",
      error,
    });
  }
};

// ✅ Get single doctor by ID
export const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.body.doctorId);
    res.status(200).send({
      success: true,
      message: "Single doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching doctor info",
    });
  }
};

// ✅ Get doctor appointments
export const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointments = await appointmentModel.find({ doctorId: doctor._id });
    res.status(200).send({
      success: true,
      message: "Doctor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching doctor appointments",
    });
  }
};

// ✅ Update appointment status
export const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    const user = await userModel.findById(appointment.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.notification = user.notification || [];
    user.notification.push({
      type: "status-updated",
      message: `Your appointment status has been updated to ${status}`,
      onClickPath: "/doctor-appointments",
    });

    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating appointment status",
    });
  }
};

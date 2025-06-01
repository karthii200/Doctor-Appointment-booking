import moment from "moment";
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
// doctorCtrl.js - in doctorAppointmentsController
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

        const formattedAppointments = appointments.map((appointment) => ({
            ...appointment._doc,
            // Assuming `date` and `time` are stored as full Date objects
            date: moment(appointment.date).format("DD-MM-YYYY"),
            time: moment(appointment.time).format("hh:mm A"), // Now `appointment.time` is a Date object
        }));

        res.status(200).send({
            success: true,
            message: "Doctor appointments fetched successfully",
            data: formattedAppointments,
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

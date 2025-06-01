
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
// export const doctorAppointmentsController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findOne({ userId: req.body.userId });
//     if (!doctor) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     const appointments = await appointmentModel.find({ doctorId: doctor._id });
//     res.status(200).send({
//       success: true,
//       message: "Doctor appointments fetched successfully",
//       data: appointments,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in fetching doctor appointments",
//     });
//   }
// };

// ✅ Get Doctor Appointments (Fixed)
export const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }

    const appointments = await appointmentModel.find({ doctorId: doctor._id });

    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment._doc,
      date: moment(appointment.date, "DD-MM-YYYY").format("DD-MM-YYYY"),
      time: moment(appointment.time, "HH:mm").format("HH:mm A"), // Display in 12-hour format (AM/PM)
    }));

    res.status(200).send({
      success: true,
      message: "Doctor Appointments Fetched Successfully",
      data: formattedAppointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error, message: "Error Fetching Doctor Appointments" });
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


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import userModel from "../models/userModels.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// Register Controller
export const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({ message: "User Already Exists", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: `Register Error: ${error.message}` });
  }
};

// Login Controller
export const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.status(200).send({ message: "User not found", success: false });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(200).send({ message: "Invalid Email or Password", success: false });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Login Error: ${error.message}` });
  }
};

// Auth Controller
export const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("-password");
    if (!user) return res.status(200).send({ message: "User not found", success: false });

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Auth Error", success: false, error });
  }
};

// Apply Doctor Controller
// export const applyDoctorController = async (req, res) => {
//   try {
//     const newDoctor = new doctorModel({ ...req.body, status: "pending" });
//     await newDoctor.save();

//     const adminUser = await userModel.findOne({ isAdmin: true });
//     adminUser.notification.push({
//       type: "apply-doctor-request",
//       message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor Account`,
//       data: { doctorId: newDoctor._id, name: `${newDoctor.firstName} ${newDoctor.lastName}`, onClickPath: "/admin/doctors" },
//     });

//     await adminUser.save();
//     res.status(201).send({ success: true, message: "Doctor Account Application Submitted" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, error, message: "Error While Applying for Doctor" });
//   }
// };

export const applyDoctorController = async (req, res) => {
  try {
    // Format timings safely in backend
    const formattedTimings = [
      moment(req.body.timings[0]).format("HH:mm"),
      moment(req.body.timings[1]).format("HH:mm"),
    ];

    const newDoctor = new doctorModel({
      ...req.body,
      timings: formattedTimings,
      status: "pending",
    });

    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    adminUser.notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: `${newDoctor.firstName} ${newDoctor.lastName}`,
        onClickPath: "/admin/doctors",
      },
    });

    await adminUser.save();
    res.status(201).send({
      success: true,
      message: "Doctor Account Application Submitted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying for Doctor",
    });
  }
};


// Get Notifications
// export const getAllNotificationController = async (req, res) => {
//   try {
//     const user = await userModel.findById(req.body.userId);
//     if (!user) return res.status(404).send({ message: "User not found", success: false });

//     user.seenNotification = [...user.seenNotification, ...user.notification];
//     user.notification = [];
//     await user.save();

//     res.status(200).send({ success: true, message: "All notifications marked as read", data: user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Error in marking notifications", success: false, error });
//   }
// };
export const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user)
      return res.status(404).send({ message: "User not found", success: false });

    // Defensive: ensure these are arrays
    user.notification = Array.isArray(user.notification) ? user.notification : [];
    user.seenNotification = Array.isArray(user.seenNotification) ? user.seenNotification : [];

    user.seenNotification = [...user.seenNotification, ...user.notification];
    user.notification = [];

    console.log("User before saving:", user);

    await user.save();

    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: user,
    });
  } catch (error) {
    console.error("Error in getAllNotificationController:", error);
    res
      .status(500)
      .send({ message: "Error in marking notifications", success: false, error: error.message });
  }
};

// Delete Notifications
export const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    user.notification = [];
    user.seenNotification = [];
    await user.save();
    
    res.status(200).send({ success: true, message: "Notifications Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error in deleting notifications", error });
  }
};

// Get All Approved Doctors
export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({ success: true, message: "Doctors List Fetched", data: doctors });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error, message: "Error Fetching Doctors" });
  }
};

// Book Appointment
// export const bookAppointmentController = async (req, res) => {
//   try {
//     req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
//     req.body.time = moment(req.body.time, "HH:mm").toISOString();
//     req.body.status = "pending";

//     const newAppointment = new appointmentModel(req.body);
//     await newAppointment.save();

//     const doctor = await userModel.findById(req.body.doctorInfo.userId);
//     doctor.notification.push({
//       type: "New-appointment-request",
//       message: `New Appointment Request from ${req.body.userInfo.name}`,
//       onClickPath: "/user/appointments",
//     });

//     await doctor.save();
//     res.status(200).send({ success: true, message: "Appointment Booked Successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, error, message: "Error While Booking Appointment" });
//   }
// };
// ✅ Book Appointment (Fixed)

// ✅ Book Appointment (Corrected Date/Time)
export const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").format("YYYY-MM-DD");
    req.body.time = moment(req.body.time, "HH:mm").format("HH:mm");

    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    const doctor = await userModel.findById(req.body.doctorInfo.userId);
    doctor.notification.push({
      type: "New-appointment-request",
      message: `New Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });

    await doctor.save();
    res.status(200).send({ success: true, message: "Appointment Booked Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error, message: "Error While Booking Appointment" });
  }
};

// Check Appointment Availability
export const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();

    const appointments = await appointmentModel.find({
      doctorId: req.body.doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });

    res.status(200).send({
      success: true,
      message: appointments.length > 0 ? "Appointments not available" : "Appointments available",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error, message: "Error Checking Availability" });
  }
};

// Get User Appointments
// export const userAppointmentsController = async (req, res) => {
//   try {
//     const appointments = await appointmentModel.find({ userId: req.body.userId });
//     res.status(200).send({ success: true, message: "User Appointments Fetched", data: appointments });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, error, message: "Error Fetching Appointments" });
//   }
// };
// ✅ Get User Appointments (Fixed)
export const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.body.userId });

    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment._doc,
      date: moment(appointment.date, "DD-MM-YYYY").format("DD-MM-YYYY"),
      time: moment(appointment.time, "HH:mm").format("HH:mm A"), // Display in 12-hour format (AM/PM)
    }));

    res.status(200).send({ 
      success: true, 
      message: "User Appointments Fetched", 
      data: formattedAppointments 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error, message: "Error Fetching Appointments" });
  }
};

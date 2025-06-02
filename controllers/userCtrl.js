import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import userModel from "../models/userModels.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// Register Controller
const registerController = async (req, res) => {
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
const loginController = async (req, res) => {
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
const authController = async (req, res) => {
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
const applyDoctorController = async (req, res) => {
  try {
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
    adminUser.notification = adminUser.notification || [];
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

    res.status(201).send({ success: true, message: "Doctor Account Application Submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error, message: "Error While Applying for Doctor" });
  }
};

// Get All Notifications
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) return res.status(404).send({ message: "User not found", success: false });

    user.notification = Array.isArray(user.notification) ? user.notification : [];
    user.seenNotification = Array.isArray(user.seenNotification) ? user.seenNotification : [];

    user.seenNotification = [...user.seenNotification, ...user.notification];
    user.notification = [];

    await user.save();

    res.status(200).send({ success: true, message: "All notifications marked as read", data: user });
  } catch (error) {
    console.error("Error in getAllNotificationController:", error);
    res.status(500).send({ message: "Error in marking notifications", success: false, error: error.message });
  }
};

// Delete All Notifications
const deleteAllNotificationController = async (req, res) => {
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
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({ success: true, message: "Doctors List Fetched", data: doctors });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error, message: "Error Fetching Doctors" });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    if (!req.body.date || !req.body.time) {
      return res.status(400).send({ success: false, message: "Date and time are required" });
    }

    const { date, time, doctorInfo, userInfo, userId, ...restOfBody } = req.body; // Removed doctorId from destructuring as we'll find it

    const appointmentDateTime = moment(`${date} ${time}`, "DD-MM-YYYY HH:mm");

    if (!appointmentDateTime.isValid()) {
      return res.status(400).send({ success: false, message: "Invalid date or time format" });
    }

    // --- NEW LOGIC START ---
    // Find the actual doctorModel document using the userId from doctorInfo
    const doctorProfile = await doctorModel.findOne({ userId: doctorInfo.userId });

    if (!doctorProfile) {
        return res.status(404).send({ success: false, message: "Doctor profile not found for booking." });
    }

    // Now use doctorProfile._id for the appointmentModel.doctorId field
    const actualDoctorIdToSave = doctorProfile._id;
    // --- NEW LOGIC END ---

    const newAppointment = new appointmentModel({
      ...restOfBody,
      doctorId: actualDoctorIdToSave, // Use the correct doctor ID from doctorModel
      userId: userId, // This is the patient's userId
      doctorInfo: doctorInfo,
      userInfo: userInfo,
      date: appointmentDateTime.toDate(),
      time: appointmentDateTime.toDate(),
      status: "pending",
    });

    await newAppointment.save();

    // Notify doctor (this part should already be working as you said notifications work)
    const doctorUser = await userModel.findById(doctorInfo.userId);
    if (!doctorUser) {
        return res.status(404).send({ success: false, message: "Doctor user not found for notification" });
    }
    doctorUser.notification = doctorUser.notification || [];
    const patientName = userInfo?.name || "Someone";
    doctorUser.notification.push({
      type: "New-appointment-request",
      message: `New Appointment Request from ${patientName}`,
      onClickPath: "/doctor/appointments", // Changed this to doctor appointments path if needed
    });
    await doctorUser.save();

    res.status(200).send({ success: true, message: "Appointment Booked Successfully" });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    res.status(500).send({
        success: false,
        message: `Error While Booking Appointment: ${error.message || 'Unknown error'}`,
        error: error.errors ? error.errors : error.message,
    });
  }
};
// Check Appointment Availability
// userCtrl.js - in bookingAvailabilityController
const bookingAvailabilityController = async (req, res) => {
  try {
    const requestedDateTime = moment(`${req.body.date} ${req.body.time}`, "DD-MM-YYYY HH:mm");

    if (!requestedDateTime.isValid()) {
      return res.status(400).send({ success: false, message: "Invalid date or time format" });
    }

    // Define a small window around the requested time to check for overlaps
    // For example, if appointments are 30 mins, you might check +/- 15 mins
    const bufferMinutes = 29; // Adjust based on your slot duration
    const fromTime = moment(requestedDateTime).subtract(bufferMinutes, "minutes").toDate();
    const toTime = moment(requestedDateTime).add(bufferMinutes, "minutes").toDate();

    const appointments = await appointmentModel.find({
      doctorId: req.body.doctorId,
      // Query for appointments that overlap with the requested slot
      // The stored `time` field is the actual appointment start time.
      // We are looking for appointments where the stored time falls within our
      // `fromTime` and `toTime` window.
      time: { $gte: fromTime, $lte: toTime },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        success: false, // Change to false if not available
        message: "Appointments not available for this slot",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Appointments available",
    });
  } catch (error) {
    console.error("Availability Error:", error);
    res.status(500).send({ success: false, error, message: "Error Checking Availability" });
  }
};

// Get User Appointments
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.body.userId });
    res.status(200).send({ success: true, message: "User Appointments Fetched", data: appointments });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error, message: "Error Fetching User Appointments" });
  }
};

// 👇 FINAL EXPORT
export {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
};

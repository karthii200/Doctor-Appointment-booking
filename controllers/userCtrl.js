// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import moment from "moment";
// import userModel from "../models/userModels.js";
// import doctorModel from "../models/doctorModel.js";
// import appointmentModel from "../models/appointmentModel.js";

// // Register Controller
// const registerController = async (req, res) => {
//   try {
//     const existingUser = await userModel.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res.status(200).send({ message: "User Already Exists", success: false });
//     }
//     const salt = await bcrypt.genSalt(10);
//     req.body.password = await bcrypt.hash(req.body.password, salt);
//     const newUser = new userModel(req.body);
//     await newUser.save();
//     res.status(201).send({ message: "Registered Successfully", success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: `Register Error: ${error.message}` });
//   }
// };

// // Login Controller
// const loginController = async (req, res) => {
//   try {
//     const user = await userModel.findOne({ email: req.body.email });
//     if (!user) return res.status(200).send({ message: "User not found", success: false });

//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!isMatch) return res.status(200).send({ message: "Invalid Email or Password", success: false });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
//     res.status(200).send({ message: "Login Success", success: true, token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: `Login Error: ${error.message}` });
//   }
// };

// // Auth Controller
// const authController = async (req, res) => {
//   try {
//     const user = await userModel.findById(req.body.userId).select("-password");
//     if (!user) return res.status(200).send({ message: "User not found", success: false });
//     res.status(200).send({ success: true, data: user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Auth Error", success: false, error });
//   }
// };

// // Apply Doctor Controller
// const applyDoctorController = async (req, res) => {
//   try {
//     const formattedTimings = [
//       moment(req.body.timings[0]).format("HH:mm"),
//       moment(req.body.timings[1]).format("HH:mm"),
//     ];

//     const newDoctor = new doctorModel({
//       ...req.body,
//       timings: formattedTimings,
//       status: "pending",
//     });

//     await newDoctor.save();

//     const adminUser = await userModel.findOne({ isAdmin: true });
//     adminUser.notification = adminUser.notification || [];
//     adminUser.notification.push({
//       type: "apply-doctor-request",
//       message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor Account`,
//       data: {
//         doctorId: newDoctor._id,
//         name: `${newDoctor.firstName} ${newDoctor.lastName}`,
//         onClickPath: "/admin/doctors",
//       },
//     });

//     await adminUser.save();

//     res.status(201).send({ success: true, message: "Doctor Account Application Submitted" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, error, message: "Error While Applying for Doctor" });
//   }
// };

// // Get All Notifications
// const getAllNotificationController = async (req, res) => {
//   try {
//     const user = await userModel.findById(req.body.userId);
//     if (!user) return res.status(404).send({ message: "User not found", success: false });

//     user.notification = Array.isArray(user.notification) ? user.notification : [];
//     user.seenNotification = Array.isArray(user.seenNotification) ? user.seenNotification : [];

//     user.seenNotification = [...user.seenNotification, ...user.notification];
//     user.notification = [];

//     await user.save();

//     res.status(200).send({ success: true, message: "All notifications marked as read", data: user });
//   } catch (error) {
//     console.error("Error in getAllNotificationController:", error);
//     res.status(500).send({ message: "Error in marking notifications", success: false, error: error.message });
//   }
// };

// // Delete All Notifications
// const deleteAllNotificationController = async (req, res) => {
//   try {
//     const user = await userModel.findById(req.body.userId);
//     user.notification = [];
//     user.seenNotification = [];
//     await user.save();
//     res.status(200).send({ success: true, message: "Notifications Deleted Successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: "Error in deleting notifications", error });
//   }
// };

// // Get All Approved Doctors
// const getAllDoctorsController = async (req, res) => {
//   try {
//     const doctors = await doctorModel.find({ status: "approved" });
//     res.status(200).send({ success: true, message: "Doctors List Fetched", data: doctors });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, error, message: "Error Fetching Doctors" });
//   }
// };

// // Book Appointment
// const bookAppointmentController = async (req, res) => {
//   try {
//     // Format date
//     const formattedDate = moment(req.body.date, "DD-MM-YYYY").toDate();

//     // Combine date + time
//     const [hours, minutes] = req.body.time.split(":");
//     const fullTime = moment(formattedDate).set({ hour: +hours, minute: +minutes }).toDate();

//     // Create new appointment
//     const newAppointment = new appointmentModel({
//       ...req.body,
//       date: formattedDate,
//       time: fullTime,
//       status: "pending",
//     });

//     await newAppointment.save();

//     // Notify doctor
//     const doctorUser = await userModel.findById(req.body.doctorInfo.userId);
//     doctorUser.notification = doctorUser.notification || [];
//     doctorUser.notification.push({
//       type: "New-appointment-request",
//       message: `New Appointment Request from ${req.body.userInfo.name}`,
//       onClickPath: "/user/appointments",
//     });

//     await doctorUser.save();

//     res.status(200).send({ success: true, message: "Appointment Booked Successfully" });
//   } catch (error) {
//     console.error("Book Appointment Error:", error);
//     res.status(500).send({ success: false, error, message: "Error While Booking Appointment" });
//   }
// };

// // Check Appointment Availability
// const bookingAvailabilityController = async (req, res) => {
//   try {
//     const formattedDate = moment(req.body.date, "DD-MM-YYYY").toDate();

//     const [hours, minutes] = req.body.time.split(":");
//     const reqTime = moment(formattedDate).set({ hour: +hours, minute: +minutes });

//     const fromTime = moment(reqTime).subtract(1, "hours").toDate();
//     const toTime = moment(reqTime).add(1, "hours").toDate();

//     const appointments = await appointmentModel.find({
//       doctorId: req.body.doctorId,
//       date: formattedDate,
//       time: { $gte: fromTime, $lte: toTime },
//     });

//     if (appointments.length > 0) {
//       return res.status(200).send({
//         success: true,
//         message: "Appointments not available",
//       });
//     }

//     return res.status(200).send({
//       success: true,
//       message: "Appointments available",
//     });
//   } catch (error) {
//     console.error("Availability Error:", error);
//     res.status(500).send({ success: false, error, message: "Error Checking Availability" });
//   }
// };


// // Get User Appointments
// const userAppointmentsController = async (req, res) => {
//   try {
//     const appointments = await appointmentModel.find({ userId: req.body.userId });
//     res.status(200).send({ success: true, message: "User Appointments Fetched", data: appointments });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, error, message: "Error Fetching User Appointments" });
//   }
// };

// export {
//   registerController,
//   loginController,
//   authController,
//   applyDoctorController,
//   getAllNotificationController,
//   deleteAllNotificationController,
//   getAllDoctorsController,
//   bookAppointmentController,
//   bookingAvailabilityController,
//   userAppointmentsController,
// };
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

// ✅ Updated Book Appointment Controller
// const bookAppointmentController = async (req, res) => {
//   try {
//     if (!req.body.date || !req.body.time) {
//       return res.status(400).send({ success: false, message: "Date and time are required" });
//     }

//     const formattedDate = moment(req.body.date, "DD-MM-YYYY").toDate();
//     if (!formattedDate || isNaN(formattedDate.getTime())) {
//       return res.status(400).send({ success: false, message: "Invalid date format" });
//     }

//     const [hours, minutes] = req.body.time.split(":");
//     if (hours === undefined || minutes === undefined) {
//       return res.status(400).send({ success: false, message: "Invalid time format" });
//     }

//     const fullTime = moment(formattedDate).set({ hour: +hours, minute: +minutes }).toDate();

//     const newAppointment = new appointmentModel({
//       ...req.body,
//       date: formattedDate,
//       time: fullTime,
//       status: "pending",
//     });

//     await newAppointment.save();

//     if (!req.body.doctorInfo?.userId) {
//       return res.status(400).send({ success: false, message: "Doctor userId is required" });
//     }

//     const doctorUser = await userModel.findById(req.body.doctorInfo.userId);

//     if (!doctorUser) {
//       return res.status(404).send({ success: false, message: "Doctor user not found" });
//     }

//     doctorUser.notification = doctorUser.notification || [];

//     const patientName = req.body.userInfo?.name || "Someone";

//     doctorUser.notification.push({
//       type: "New-appointment-request",
//       message: `New Appointment Request from ${patientName}`,
//       onClickPath: "/user/appointments",
//     });

//     await doctorUser.save();

//     res.status(200).send({ success: true, message: "Appointment Booked Successfully" });
//   } catch (error) {
//     console.error("Book Appointment Error:", error);
//     res.status(500).send({ success: false, error, message: "Error While Booking Appointment" });
//   }
// };
// userCtrl.js - in bookAppointmentController
// userCtrl.js - in bookAppointmentController
// userCtrl.js - in bookAppointmentController
const bookAppointmentController = async (req, res) => {
  try {
    if (!req.body.date || !req.body.time) {
      return res.status(400).send({ success: false, message: "Date and time are required" });
    }

    // Destructure req.body to extract date, time, doctorInfo, userInfo, doctorId, userId
    // and collect the rest of the properties in 'restOfBody'.
    const { date, time, doctorInfo, userInfo, doctorId, userId, ...restOfBody } = req.body;

    // Combine date and time into a single moment object
    const appointmentDateTime = moment(`${date} ${time}`, "DD-MM-YYYY HH:mm");

    if (!appointmentDateTime.isValid()) {
      return res.status(400).send({ success: false, message: "Invalid date or time format" });
    }

    const newAppointment = new appointmentModel({
      ...restOfBody, // This spreads any other properties from req.body (e.g., any new fields you might add later)
      // Explicitly set the required fields with the correct types
      doctorId: doctorId,
      userId: userId,
      doctorInfo: doctorInfo,
      userInfo: userInfo,
      date: appointmentDateTime.toDate(), // This is the ONLY date value passed to the model
      time: appointmentDateTime.toDate(), // This is the ONLY time value passed to the model
      status: "pending",
    });

    await newAppointment.save(); // This should now succeed

    // ... (rest of your existing notification logic, ensure doctorInfo and userInfo are used from destructured variables)
    const doctorUser = await userModel.findById(doctorInfo.userId); // Use destructured doctorInfo
    if (!doctorUser) {
        return res.status(404).send({ success: false, message: "Doctor user not found" });
    }
    doctorUser.notification = doctorUser.notification || [];
    const patientName = userInfo?.name || "Someone"; // Use destructured userInfo
    doctorUser.notification.push({
      type: "New-appointment-request",
      message: `New Appointment Request from ${patientName}`,
      onClickPath: "/user/appointments",
    });
    await doctorUser.save();

    res.status(200).send({ success: true, message: "Appointment Booked Successfully" });
  // userCtrl.js - in bookAppointmentController's catch block
} catch (error) {
    // --- IMPORTANT DEBUGGING LOG ---
    console.error("Backend Booking Error (Detailed):", JSON.stringify(error, null, 2));
    // --- END DEBUGGING LOG ---

    // Send more detailed error message to the frontend for debugging
    res.status(500).send({
        success: false,
        message: `Error While Booking Appointment: ${error.message || 'Unknown error'}`,
        // If it's a Mongoose validation error, it will have an 'errors' property
        error: error.errors ? error.errors : error.message, // Send specific validation errors if present
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

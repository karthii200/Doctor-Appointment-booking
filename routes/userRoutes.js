
import express from "express";
import {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} from "../controllers/userCtrl.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// ✅ Create Express router
const router = express.Router();

// ✅ Routes
// LOGIN || POST
router.post("/login", loginController);

// REGISTER || POST
router.post("/register", registerController);

// AUTH || POST
router.post("/getUserData", authMiddleware, authController);

// APPLY DOCTOR || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

// GET ALL NOTIFICATIONS || POST
router.post("/get-all-notification", authMiddleware, getAllNotificationController);

// DELETE ALL NOTIFICATIONS || POST
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);

// GET ALL DOCTORS || GET
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// BOOK APPOINTMENT || POST
router.post("/book-appointment", authMiddleware, bookAppointmentController);

// CHECK BOOKING AVAILABILITY || POST
router.post("/booking-availbility", authMiddleware, bookingAvailabilityController);

// GET USER APPOINTMENTS || GET
router.get("/user-appointments", authMiddleware, userAppointmentsController);

export default router;

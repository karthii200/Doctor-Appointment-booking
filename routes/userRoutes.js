// const express = require("express");
// const {
//   loginController,
//   registerController,
//   authController,
//   applyDoctorController,
//   getAllNotificationController,
//   deleteAllNotificationController,
//   getAllDocotrsController,
//   bookeAppointmnetController,
//   bookingAvailabilityController,
//   userAppointmentsController,
// } = require("../controllers/userCtrl");
// const authMiddleware = require("../middlewares/authMiddleware");

// //router onject
// const router = express.Router();

// //routes
// //LOGIN || POST
// router.post("/login", loginController);

// //REGISTER || POST
// router.post("/register", registerController);

// //Auth || POST
// router.post("/getUserData", authMiddleware, authController);

// //APply Doctor || POST
// router.post("/apply-doctor", authMiddleware, applyDoctorController);

// //Notifiaction  Doctor || POST
// router.post(
//   "/get-all-notification",
//   authMiddleware,
//   getAllNotificationController
// );
// //Notifiaction  Doctor || POST
// router.post(
//   "/delete-all-notification",
//   authMiddleware,
//   deleteAllNotificationController
// );

// //GET ALL DOC
// router.get("/getAllDoctors", authMiddleware, getAllDocotrsController);

// //BOOK APPOINTMENT
// router.post("/book-appointment", authMiddleware, bookeAppointmnetController);

// //Booking Avliability
// router.post(
//   "/booking-availbility",
//   authMiddleware,
//   bookingAvailabilityController
// );

// //Appointments List
// router.get("/user-appointments", authMiddleware, userAppointmentsController);

// module.exports = router;
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

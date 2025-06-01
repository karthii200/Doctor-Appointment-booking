
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

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/getUserData", authMiddleware, authController);
router.post("/apply-doctor", authMiddleware, applyDoctorController);
router.post("/get-all-notification", authMiddleware, getAllNotificationController);
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);
router.post("/book-appointment", authMiddleware, bookAppointmentController);
router.post("/booking-availbility", authMiddleware, bookingAvailabilityController);
router.get("/user-appointments", authMiddleware, userAppointmentsController);

export default router;
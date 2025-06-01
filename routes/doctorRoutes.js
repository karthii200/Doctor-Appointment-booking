
// const express = require("express");
// const {
//   getDoctorInfoController,
//   updateProfileController,
//   getDoctorByIdController,
//   doctorAppointmentsController,
//   updateStatusController,
// } = require("../controllers/doctorCtrl");
// const authMiddleware = require("../middlewares/authMiddleware");
// const router = express.Router();

// //POST SINGLE DOC INFO
// router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

// //POST UPDATE PROFILE
// router.post("/updateProfile", authMiddleware, updateProfileController);

// //POST  GET SINGLE DOC INFO
// router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

// //GET Appointments
// router.get(
//   "/doctor-appointments",
//   authMiddleware,
//   doctorAppointmentsController
// );

// //POST Update Status
// router.post("/update-status", authMiddleware, updateStatusController);

// module.exports = router;

import express from "express";
import {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} from "../controllers/doctorCtrl.js"; // ✅ Ensure doctorCtrl.js also uses ES6

import authMiddleware from "../middlewares/authMiddleware.js"; // ✅ Ensure authMiddleware.js uses ES6

const router = express.Router();

// ✅ POST: Get single doctor info
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

// ✅ POST: Update profile
router.post("/updateProfile", authMiddleware, updateProfileController);

// ✅ POST: Get doctor by ID
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

// ✅ GET: Doctor appointments
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController);

// ✅ POST: Update appointment status
router.post("/update-status", authMiddleware, updateStatusController);

// ✅ Export router using ES6 syntax
export default router;

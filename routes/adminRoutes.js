// const express = require("express");
// const {
//   getAllUsersController,
//   getAllDoctorsController,
//   changeAccountStatusController,
// } = require("../controllers/adminCtrl");
// const authMiddleware = require("../middlewares/authMiddleware");

// const router = express.Router();

// //GET METHOD || USERS
// router.get("/getAllUsers", authMiddleware, getAllUsersController);

// //GET METHOD || DOCTORS
// router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// //POST ACCOUNT STATUS
// router.post(
//   "/changeAccountStatus",
//   authMiddleware,
//   changeAccountStatusController
// );

// module.exports = router;
import express from "express";
import {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} from "../controllers/adminCtrl.js"; // ✅ Ensure the controller file also uses ES6

import authMiddleware from "../middlewares/authMiddleware.js"; // ✅ Ensure the middleware file also uses ES6

const router = express.Router();

// ✅ GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// ✅ GET METHOD || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// ✅ POST METHOD || CHANGE ACCOUNT STATUS
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController);

// ✅ Export as ES6 module
export default router;

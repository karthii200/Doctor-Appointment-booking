// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "name is require"],
//   },
//   email: {
//     type: String,
//     required: [true, "email is require"],
//   },
//   password: {
//     type: String,
//     required: [true, "password is require"],
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false,
//   },
//   isDoctor: {
//     type: Boolean,
//     default: false,
//   },
//   notifcation: {
//     type: Array,
//     default: [],
//   },
//   seennotification: {
//     type: Array,
//     default: [],
//   },
// });

// const userModel = mongoose.model("users", userSchema);

// module.exports = userModel;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"], // Fixed spelling: "require" → "required"
  },
  email: {
    type: String,
    required: [true, "email is required"], // Fixed spelling
  },
  password: {
    type: String,
    required: [true, "password is required"], // Fixed spelling
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  notification: { // Fixed spelling from "notifcation"
    type: Array,
    default: [],
  },
  seenNotification: { // Fixed spelling from "seennotification"
    type: Array,
    default: [],
  },
});

const userModel = mongoose.model("users", userSchema);

export default userModel; // ✅ Export using ES Module syntax

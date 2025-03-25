// const doctorModel = require("../models/doctorModel");
// const userModel = require("../models/userModels");

// const getAllUsersController = async (req, res) => {
//   try {
//     const users = await userModel.find({});
//     res.status(200).send({
//       success: true,
//       message: "users data list",
//       data: users,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "erorr while fetching users",
//       error,
//     });
//   }
// };

// const getAllDoctorsController = async (req, res) => {
//   try {
//     const doctors = await doctorModel.find({});
//     res.status(200).send({
//       success: true,
//       message: "Doctors Data list",
//       data: doctors,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "error while getting doctors data",
//       error,
//     });
//   }
// };

// // doctor account status
// const changeAccountStatusController = async (req, res) => {
//   try {
//     const { doctorId, status } = req.body;
//     const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
//     const user = await userModel.findOne({ _id: doctor.userId });
//     const notifcation = user.notifcation;
//     notifcation.push({
//       type: "doctor-account-request-updated",
//       message: `Your Doctor Account Request Has ${status} `,
//       onClickPath: "/notification",
//     });
//     user.isDoctor = status === "approved" ? true : false;
//     await user.save();
//     res.status(201).send({
//       success: true,
//       message: "Account Status Updated",
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Eror in Account Status",
//       error,
//     });
//   }
// };

// module.exports = {
//   getAllDoctorsController,
//   getAllUsersController,
//   changeAccountStatusController,
// };
import doctorModel from "../models/doctorModel.js"; // ✅ Use ES6 import
import userModel from "../models/userModels.js"; // ✅ Use ES6 import

// ✅ Get All Users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users data list",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};

// ✅ Get All Doctors
export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors Data list",
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting doctors data",
      error,
    });
  }
};

// ✅ Change Doctor Account Status
export const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const user = await userModel.findOne({ _id: doctor.userId });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Add notification
    user.notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status}`,
      onClickPath: "/notification",
    });

    // ✅ Update user doctor status
    user.isDoctor = status === "approved";

    await user.save();

    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Account Status",
      error,
    });
  }
};

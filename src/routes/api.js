const express = require("express");
const {
  registration,
  login,
  updateProfile,
  profileDetails,
  verifyEmail,
  verifyOtp,
  createNewPass,
} = require("../controllers/UserControllers");
const AuthVerifyMiddleware = require("../middlewares/AuthVerifyMiddleware");
const {
  createTask,
  deleteTask,
  updateStatusTask,
  getAllTasks,
  updateTask,
  getTaskByStatus,
  countTasksByStatus,
} = require("../controllers/TaskControllers");

// Import routes
const router = express.Router();

// Define routes for user endpoints
router.post("/registration", registration);
router.post("/login", login);
router.post("/updateProfile", AuthVerifyMiddleware, updateProfile);
router.get("/profileDetails", AuthVerifyMiddleware, profileDetails);
// Define routes for task endpoints
router.post("/createTask", AuthVerifyMiddleware, createTask);
router.get("/getAllTasks", AuthVerifyMiddleware, getAllTasks);
router.post("/updateTask/:id", AuthVerifyMiddleware, updateTask);
router.delete("/deleteTask/:id", AuthVerifyMiddleware, deleteTask);
router.get(
  "/updateStatusTask/:id/:status",
  AuthVerifyMiddleware,
  updateStatusTask
);
router.get("/getTaskByStatus/:status", AuthVerifyMiddleware, getTaskByStatus);
router.get("/countTasksByStatus", AuthVerifyMiddleware, countTasksByStatus);

//reset password api's
router.get("/verifyEmail/:email", verifyEmail);
router.post("/verifyOtp/:email/:otp", verifyOtp);
router.post("/RecoverResetPass", createNewPass);

module.exports = router;

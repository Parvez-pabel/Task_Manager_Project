const express = require("express");
const { registration, login, updateProfile } = require("../controllers/UserControllers");
const AuthVerifyMiddleware = require("../middlewares/AuthVerifyMiddleware");

// Import routes
const router = express.Router();

router.post("/registration", registration);
router.post("/login", login);
router.post("/updateProfile",AuthVerifyMiddleware, updateProfile);

module.exports = router;

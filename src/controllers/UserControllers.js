//registration
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const OtpModel = require("../models/OtpModel");
const SendEmailUtility = require("../utility/SendEmailUtility");

exports.registration = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body); // Log request body

    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await UserModel.create(req.body);
    res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

//login
exports.login = async (req, res) => {
  try {
    let reqBody = req.body;

    // Use await instead of callback
    let data = await UserModel.aggregate([
      { $match: reqBody },
      {
        $project: {
          _id: 0,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
        },
      },
    ]);

    if (data.length > 0) {
      let Payload = {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // Token expires in 24h
        data: data[0]["email"],
      };

      let token = jwt.sign(Payload, "abcd1234xyz");

      return res.status(200).json({
        message: "User logged in successfully",
        token: token,
        user: data,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};

//profile update

exports.updateProfile = async (req, res) => {
  try {
    let reqBody = req.body;
    let email = req.headers["email"];
    let user = await UserModel.updateOne({ email: email }, reqBody, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

//profile details

exports.profileDetails = async (req, res) => {
  try {
    let email = req.headers["email"];
    const data = await UserModel.aggregate([
      { $match: { email: email } },
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
          password: 1,
        },
      },
    ]);

    if (!data.length) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User profile", data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error getting user profile", error: err.message });
  }
};

//email verification for reset password

exports.verifyEmail = async (req, res) => {
  let email = req.params.email;
  let OtpCode = Math.floor(100000 + Math.random() * 900000);

  try {
    //email query
    let UserCount = await UserModel.aggregate([
      { $match: { email: email } },
      { $count: "total" },
    ]);
    if (UserCount.length > 0) {
      //otp insert
      await OtpModel.create({
        email: email,
        otp: OtpCode,
      });
      //send mail
      let SendEmail = await SendEmailUtility(
        email,
        `Your 6-digit OTP code is: ${OtpCode}`,
        "Task Manager Reset Password"
      );
      res.status(200).json({
        status: "Success",
        otp: OtpCode,
        data: SendEmail,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
};

// OTP verification for reset password

exports.verifyOtp = async (req, res) => {
  let email = req.params.email;
  let otp = req.params.otp;
  let status = 0;
  let UpdatedStatus = 1;

  try {
    let OtpData = await OtpModel.aggregate([
      {
        $match: { email: email, otp: otp, status: status },
      },
      { $count: "total" },
    ]);

    if (otp.length > 0) {
      let otpUpdate = await OtpModel.updateOne(
        {
          email: email,
          otp: otp,
          status: status,
        },
        {
          email: email,
          otp: otp,
          status: UpdatedStatus,
        }
      );

      return res
        .status(200)
        .json({ message: "OTP verified successfully", data: otpUpdate });
    } else {
      res.status(404).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};
//reset password

exports.createNewPass = async (req, res) => {
  let email = req.params.email;
  let otp = req.params.otp;
  let newPass = req.params["password"];
  let UpdatedStatus = 1;

  try {
    let OtpUsedData = await OtpModel.aggregate([
      {
        $match: { email: email, otp: otp, status: UpdatedStatus },
      },
      { $count: "total" },
    ]);

    if (OtpUsedData.length > 0) {
      let resetPass = await OtpModel.updateOne(
        {
          email: email,
        },
        {
          password: newPass,
        }
      );

      return res
        .status(200)
        .json({ message: "Reset Password successfully", data: resetPass });
    } else {
      res.status(404).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

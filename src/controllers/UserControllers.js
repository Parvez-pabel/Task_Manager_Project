//registration
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

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

exports.profileDetails = (req, res) => {
  let email = req.headers["email"];
  UserModel.aggregate(
    [
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
    ],
    (err, data) => {
      if ((err, data)) {
        return res
          .status(400)
          .json({ message: "Error getting user profile", err: err.message });
      } else {
        return res.status(200).json({ message: "User profile", user: data });
      }
    }
  );
};

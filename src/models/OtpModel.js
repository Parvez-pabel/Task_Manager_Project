const mongoose = require("mongoose");

const OTPsSchema = mongoose.Schema(
  {
    email: {
      type: String,
    },
    otp: {
      type: String,
    },
    status: {
        type: Number,
        default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("otps", OTPsSchema);

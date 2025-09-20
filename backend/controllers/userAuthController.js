const User = require("../models/User");
const Otp = require("../models/Otp");

// Mock SMS sender
const sendOtpToMobile = async (mobile, otp) => {
  console.log(`OTP for ${mobile}: ${otp}`);
};

exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: "Mobile required" });

    const otp = "" + Math.floor(1000 + Math.random() * 9000);

    await Otp.create({
      mobile,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOtpToMobile(mobile, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp)
      return res.status(400).json({ error: "Missing fields" });

    const otpDoc = await Otp.findOne({ mobile, otp });
    if (!otpDoc)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    await Otp.deleteMany({ mobile });

    let user = await User.findOne({ mobile });
    if (!user) {
      user = await User.create({ mobile });
    }

    res.json({
      message: "Login successful",
      user,
      token: "dummy-jwt-for-now",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

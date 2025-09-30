const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Dev mode flag: true if NODE_ENV not set to "production"
const DEV_MODE = process.env.NODE_ENV !== "production";

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: "Mobile required" });

    const formattedMobile = mobile.startsWith("+") ? mobile : "+91" + mobile;

    // Generate 6-digit OTP
    const otp = "" + Math.floor(100000 + Math.random() * 900000);

    if (DEV_MODE) {
      // Log OTP for development; skip real SMS
      console.log(`DEV OTP for ${formattedMobile}: ${otp}`);
      return res.json({ message: "OTP sent (dev mode)", otp });
    }

    // TODO: Add Twilio or any SMS provider here for production
    return res.json({ message: "OTP would be sent here in production" });

  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ error: "Missing fields" });

    const formattedMobile = mobile.startsWith("+") ? mobile : "+91" + mobile;

    if (DEV_MODE) {
      console.log(`DEV VERIFY OTP for ${formattedMobile}: ${otp}`);
      // Accept any 6-digit OTP in dev mode
      if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({ error: "OTP must be 6 digits" });
      }
    } else {
      // TODO: Verify via Twilio or SMS provider in production
    }

    // Find or create user
    let user = await User.findOne({ mobile: formattedMobile });
    if (!user) {
      user = await User.create({ mobile: formattedMobile });
    }

    // Generate token with role-based expiry (1 day for users, 7 days for admins)
    const token = generateToken(user._id, user.role || "user"); // default to "user"

    if (DEV_MODE) {
      console.log(`DEV JWT Token for ${formattedMobile}: ${token}`);
    }

    res.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

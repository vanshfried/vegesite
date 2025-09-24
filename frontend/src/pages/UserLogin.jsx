// src/pages/UserLogin.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/UserLogin.css";

export default function UserLogin() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill("")); // 6-digit OTP
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setMobile(value);
  };

  const sendOtp = async () => {
    if (mobile.length !== 10) {
      setMessage("Enter a valid 10-digit mobile number");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/user/send-otp`,
        { mobile: "+91" + mobile }
      );
      setMessage("OTP sent successfully!");
      setStep(2);
      if (res.data.otp) console.log("DEV OTP:", res.data.otp);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only digits, max 1 char
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) otpRefs.current[index + 1].focus();
    if (!value && index > 0) otpRefs.current[index - 1].focus();
  };

  const verifyOtp = async () => {
    const otpStr = otp.join("");
    if (otpStr.length < 6) {
      setMessage("Enter the complete 6-digit OTP");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/user/verify-otp`,
        { mobile: "+91" + mobile, otp: otpStr }
      );
      localStorage.setItem("userToken", res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) otpRefs.current[0].focus();
  }, [step]);

  return (
    <div className="user-login">
      <h2>User OTP Login</h2>
      {message && <p className="inline-message">{message}</p>}

      {step === 1 && (
        <>
          <div className="mobile-input-wrapper">
            <span className="prefix">+91</span>
            <input
              type="text"
              placeholder="Mobile number"
              value={mobile}
              onChange={handleMobileChange}
            />
          </div>
          <button onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (otpRefs.current[index] = el)}
                onChange={(e) => handleOtpChange(index, e.target.value)}
              />
            ))}
          </div>
          <button onClick={verifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
}

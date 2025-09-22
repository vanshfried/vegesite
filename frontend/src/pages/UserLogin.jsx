// src/pages/UserLogin.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: enter mobile, 2: enter OTP
  const [testingOtp, setTestingOtp] = useState(""); // show OTP in alert for testing
  const navigate = useNavigate();

  // Step 1: Send OTP
  const sendOtp = async () => {
    if (!mobile) return alert("Please enter your mobile number");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/user/send-otp`,
        { mobile: mobile.toString() }
      );

      // Show OTP for testing only
      if (res.data.otp) {
        alert(`OTP for testing: ${res.data.otp}`);
        setTestingOtp(res.data.otp);
      } else {
        alert("OTP sent! Check console if using mock SMS.");
      }

      setStep(2);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to send OTP");
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async () => {
    if (!otp) return alert("Please enter the OTP");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/user/verify-otp`,
        { mobile: mobile.toString(), otp: otp.toString() }
      );
      localStorage.setItem("userToken", res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2>User OTP Login</h2>

      {step === 1 && (
        <>
          <input
            type="tel"
            placeholder="Mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={sendOtp}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              backgroundColor: "#4a90e2",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="number"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={verifyOtp}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              backgroundColor: "#4a90e2",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/SettingsPage.css";

const EditableCard = ({ label, value: initialValue, field, readOnly, onSave }) => {
  const [value, setValue] = useState(initialValue || "");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  const handleSave = async () => {
    try {
      if (onSave) await onSave(value);
      setEditing(false);
      setMessage("Saved successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error saving:", err);
      setMessage("Failed to save.");
    }
  };

  return (
    <div className="settings-card">
      <span className="card-label">{label}</span>
      {editing ? (
        <>
          <textarea value={value} onChange={(e) => setValue(e.target.value)} />
          {!readOnly && (
            <button className="edit-btn save" onClick={handleSave}>
              Save
            </button>
          )}
        </>
      ) : (
        <>
          <p className="card-value">{value || "Not set"}</p>
          {!readOnly && (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

const SettingsPage = () => {
  const [user, setUser] = useState({
    name: "",
    mobile: "",
    address: { houseNo: "", laneOrSector: "", landmark: "", pincode: "" },
  });
  const [activeTab, setActiveTab] = useState("Profile");

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addr = res.data.user.address || {};
      setUser({
        name: res.data.user.name || "",
        mobile: res.data.user.mobile || "",
        address: {
          houseNo: addr.houseNo || "",
          laneOrSector: addr.laneOrSector || "",
          landmark: addr.landmark || "",
          pincode: addr.pincode || "",
        },
      });
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSaveField = async (field, value) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      let payload;
      if (field.startsWith("address.")) {
        const key = field.split(".")[1];
        const newAddress = { ...user.address, [key]: value };
        payload = { address: newAddress };
        setUser((prev) => ({ ...prev, address: newAddress }));
      } else {
        payload = { [field]: value };
        setUser((prev) => ({ ...prev, [field]: value }));
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error saving field:", err);
    }
  };

  if (!localStorage.getItem("userToken"))
    return <p>Please log in to access settings.</p>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li
            className={activeTab === "Profile" ? "active" : ""}
            onClick={() => setActiveTab("Profile")}
          >
            Profile
          </li>
          <li
            className={activeTab === "Orders" ? "active" : ""}
            onClick={() => setActiveTab("Orders")}
          >
            Orders
          </li>
          <li
            className={activeTab === "Notifications" ? "active" : ""}
            onClick={() => setActiveTab("Notifications")}
          >
            Notifications
          </li>
          <li
            className={activeTab === "Payment" ? "active" : ""}
            onClick={() => setActiveTab("Payment")}
          >
            Payment
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <h1>{activeTab}</h1>

        {activeTab === "Profile" && (
          <>
            <EditableCard
              label="Name"
              value={user.name}
              field="name"
              readOnly={false}
              onSave={(val) => handleSaveField("name", val)}
            />
            <EditableCard
              label="Mobile Number"
              value={user.mobile}
              field="mobile"
              readOnly={true}
            />

            {/* Address fields in a row */}
            <div className="address-row">
              <EditableCard
                label="House / Apt No"
                value={user.address.houseNo}
                field="address.houseNo"
                readOnly={false}
                onSave={(val) => handleSaveField("address.houseNo", val)}
              />
              <EditableCard
                label="Lane / Sector"
                value={user.address.laneOrSector}
                field="address.laneOrSector"
                readOnly={false}
                onSave={(val) => handleSaveField("address.laneOrSector", val)}
              />
              <EditableCard
                label="Landmark"
                value={user.address.landmark}
                field="address.landmark"
                readOnly={false}
                onSave={(val) => handleSaveField("address.landmark", val)}
              />
              <EditableCard
                label="Pincode"
                value={user.address.pincode}
                field="address.pincode"
                readOnly={false}
                onSave={(val) => handleSaveField("address.pincode", val)}
              />
            </div>
          </>
        )}

        {activeTab === "Orders" && (
          <div className="dummy-section">Order history coming soon...</div>
        )}
        {activeTab === "Notifications" && (
          <div className="dummy-section">Notifications settings coming soon...</div>
        )}
        {activeTab === "Payment" && (
          <div className="dummy-section">Payment preferences coming soon...</div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;

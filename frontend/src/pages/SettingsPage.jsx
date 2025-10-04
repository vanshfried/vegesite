import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/SettingsPage.css";

import ProfileTab from "../pages/SettingsComponents/ProfileTab";
import NotificationsTab from "../pages/SettingsComponents/NotificationsTab";
import OrdersTab from "../pages/SettingsComponents/OrdersTab";

const SettingsPage = () => {
  const [user, setUser] = useState({
    name: "",
    mobile: "",
    address: { houseNo: "", laneOrSector: "", landmark: "", pincode: "" },
  });
  const [activeTab, setActiveTab] = useState("Profile");
  const [addressExpanded, setAddressExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  useEffect(() => { fetchUser(); }, []);

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

      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error saving field:", err);
    }
  };

  if (!localStorage.getItem("userToken"))
    return <p>Please log in to access settings.</p>;

  const tabs = ["Profile", "Orders", "Notifications"];

  return (
    <div className="dashboard-container">
      {isMobile ? (
        <ul className="mobile-tabs">
          {tabs.map((tab) => (
            <li key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
              {tab}
            </li>
          ))}
        </ul>
      ) : (
        <aside className="dashboard-sidebar">
          <h2>Dashboard</h2>
          <ul>
            {tabs.map((tab) => (
              <li key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
                {tab}
              </li>
            ))}
          </ul>
        </aside>
      )}

      <main className="dashboard-main">
        <h1>{activeTab} Settings</h1>
        {activeTab === "Profile" && (
          <ProfileTab
            user={user}
            handleSaveField={handleSaveField}
            addressExpanded={addressExpanded}
            setAddressExpanded={setAddressExpanded}
          />
        )}
        {activeTab === "Orders" && <OrdersTab />}
        {activeTab === "Notifications" && <NotificationsTab />}
      </main>
    </div>
  );
};

export default SettingsPage;

// src/utils/auth.js
import jwtDecodeCJS from "jwt-decode"; // For Vite, use this version 3.1.2 works best

const jwtDecode = (token) => {
  // fallback for ESM vs CJS issues in Vite
  return jwtDecodeCJS.default ? jwtDecodeCJS.default(token) : jwtDecodeCJS(token);
};

// ----- USER -----
export const isUserLoggedIn = () => {
  const token = localStorage.getItem("userToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    // Auto-logout if expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      logoutUser();
      return false;
    }

    return true;
  } catch (err) {
    console.error("Invalid user token:", err);
    logoutUser();
    return false;
  }
};

export const getUserId = () => {
  const token = localStorage.getItem("userToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id; // make sure your JWT payload has 'id'
  } catch (err) {
    console.error("Invalid user token:", err);
    return null;
  }
};

export const getToken = () => localStorage.getItem("userToken");

export const logoutUser = () => localStorage.removeItem("userToken");

// ----- ADMIN -----
export const isAdminLoggedIn = () => {
  const token = localStorage.getItem("adminToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      logoutAdmin();
      return false;
    }
    return true;
  } catch (err) {
    console.error("Invalid admin token:", err);
    logoutAdmin();
    return false;
  }
};

export const logoutAdmin = () => localStorage.removeItem("adminToken");

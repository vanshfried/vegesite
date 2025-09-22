// src/utils/auth.js
import * as jwtDecode from "jwt-decode";

export const isUserLoggedIn = () => !!localStorage.getItem("userToken");

export const getUserId = () => {
  const token = localStorage.getItem("userToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id; // make sure your JWT payload has 'id'
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const getToken = () => localStorage.getItem("userToken");

export const logoutUser = () => {
  localStorage.removeItem("userToken");
  // Do not clear cart here — backend will keep it
};

export const isAdminLoggedIn = () => !!localStorage.getItem("adminToken");

export const logoutAdmin = () => localStorage.removeItem("adminToken");

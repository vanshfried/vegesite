// src/utils/auth.js
export const isUserLoggedIn = () => {
  return !!localStorage.getItem("userToken");
};

export const isAdminLoggedIn = () => {
  return !!localStorage.getItem("adminToken");
};

export const logoutUser = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("cart"); // clear cart on logout too
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};

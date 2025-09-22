import { createContext, useContext, useState, useEffect } from "react";
import { isUserLoggedIn, logoutUser } from "../utils/auth"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(isUserLoggedIn());

  // Watch for login status changes (e.g. token added/removed in localStorage)
  useEffect(() => {
    const interval = setInterval(() => {
      setLoggedIn(isUserLoggedIn());
    }, 500); // check every half second, or use storage events
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    logoutUser(); // clear token/session
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

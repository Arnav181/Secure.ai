import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    console.log("AuthProvider: Initial isAuthenticated state from localStorage:", storedAuth);
    return storedAuth === "true";
  });

  const login = (token) => {
    console.log("AuthProvider: Login function called with token:", token);
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("authExpiration", Date.now() + 30 * 60 * 1000); // 30 minutes
    localStorage.setItem("token", token); // Store the JWT token
    console.log("AuthProvider: Authentication state set to true and token stored");
  };

  const logout = () => {
    console.log("AuthProvider: Logout function called");
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authExpiration");
    localStorage.removeItem("token");
    console.log("AuthProvider: Authentication state set to false and token removed");
  };

  // Check for session expiration
  useEffect(() => {
    const checkExpiration = () => {
      const expiration = localStorage.getItem("authExpiration");
      if (expiration && Date.now() > expiration) {
        console.log("AuthProvider: Session expired, logging out");
        logout();
      }
    };

    // Check immediately
    checkExpiration();

    // Check every minute
    const interval = setInterval(checkExpiration, 60000);

    return () => clearInterval(interval);
  }, []);

  console.log("AuthProvider: Current isAuthenticated state:", isAuthenticated);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

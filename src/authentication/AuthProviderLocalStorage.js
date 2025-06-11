import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const TOKEN_EXPIRY_HOURS = 24; // Token expires after 24 hours

const AuthProviderLocalStorage = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedTimestamp = localStorage.getItem("authTokenTimestamp");

    if (storedToken && storedTimestamp) {
      const tokenAge =
        (Date.now() - parseInt(storedTimestamp, 10)) / (1000 * 60 * 60); // Convert to hours

      if (tokenAge < TOKEN_EXPIRY_HOURS) {
        setToken(storedToken);
      } else {
        logout(); // Token expired, clear it
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    const timestamp = Date.now();
    localStorage.setItem("authToken", token);
    localStorage.setItem("authTokenTimestamp", timestamp.toString());
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenTimestamp");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthProviderLocalStorage;

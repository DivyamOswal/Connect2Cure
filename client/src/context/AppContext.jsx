// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosBase from "axios";

const AppContext = createContext(null);

// Axios instance
const axios = axiosBase.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});


// Attach token if exists
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("connect2cure_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔥 DEVELOPMENT MODE
// Toggle this to TRUE when backend is ready
const USE_REAL_BACKEND = false;

export const AppProvider = ({ children }) => {
  // 👇 Default logged-in user for development
  const [user, setUser] = useState(
    USE_REAL_BACKEND
      ? null
      : {
          _id: "dev-doctor-001",
          name: "Dr. Demo User",
          email: "demo@connect2cure.com",
          role: "doctor",        // <--- important for routing
        }
  );

  const [loading, setLoading] = useState(USE_REAL_BACKEND);

  // Real backend fetch only when USE_REAL_BACKEND = true
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/me");
      if (data.success) setUser(data.user);
    } catch (err) {
      console.log("Backend auth skipped (dev mode).");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (USE_REAL_BACKEND) fetchUser();
  }, []);

  return (
    <AppContext.Provider value={{ axios, user, setUser, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside <AppProvider />");
  return ctx;
};

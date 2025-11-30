import React, { useState } from "react";
import { useLocation } from "react-router-dom";

// API base URL (works locally + on Vercel)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Login = () => {
  const location = useLocation();

  // Detect role based on URL
  // /login/patient -> "patient"
  // /login/doctor  -> "doctor"
  const path = location.pathname.toLowerCase();
  const initialRole = path.includes("doctor") ? "doctor" : "patient";

  const [state, setState] = useState("login"); // "login" | "register"
  const [role, setRole] = useState(initialRole); // patient | doctor

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Common redirect logic after successful login
  const handlePostLoginRedirect = (user) => {
    // redirect to onboarding if incomplete
    if (!user.onboardingCompleted) {
      if (user.role === "patient") {
        window.location.href = "/onboarding/patient";
      } else if (user.role === "doctor") {
        window.location.href = "/onboarding/doctor";
      }
      return;
    }

    // redirect to dashboards after onboarding
    if (user.role === "doctor") {
      window.location.href = "/dashboard/doctor";
    } else {
      window.location.href = "/patient/dashboard";
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // -------------------------------
      // LOGIN FLOW
      // -------------------------------
      if (state === "login") {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        handlePostLoginRedirect(data.user);
        return;
      }

      // -------------------------------
      // REGISTER FLOW
      // -------------------------------
      const registerRes = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role, // store role on register
        }),
      });

      const regData = await registerRes.json();
      if (!registerRes.ok)
        throw new Error(regData.message || "Registration failed");

      // Auto-login after register
      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role,
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok)
        throw new Error(loginData.message || "Auto login failed");

      localStorage.setItem("accessToken", loginData.accessToken);
      localStorage.setItem("refreshToken", loginData.refreshToken);
      localStorage.setItem("user", JSON.stringify(loginData.user));

      // redirect to onboarding after signup
      if (loginData.user.role === "patient") {
        window.location.href = "/onboarding/patient";
      } else {
        window.location.href = "/onboarding/doctor";
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Toggle login/signup
  const toggleState = () => {
    setState((prev) => (prev === "login" ? "register" : "login"));
    setError("");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white shadow-lg"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login"
            ? `Login as ${role === "doctor" ? "Doctor" : "Patient"}`
            : `Sign up as ${role === "doctor" ? "Doctor" : "Patient"}`}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          {state === "login" ? "Welcome back!" : "Create your account"}
        </p>

        {/* Error message */}
        {error && (
          <p className="mt-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg py-2">
            {error}
          </p>
        )}

        {/* Role Selector */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`px-3 py-1 rounded-full text-sm border ${
              role === "patient"
                ? "bg-[#FF8040] text-white border-[#FF8040]"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`px-3 py-1 rounded-full text-sm border ${
              role === "doctor"
                ? "bg-[#FF8040] text-white border-[#FF8040]"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Doctor
          </button>
        </div>

        {/* Name field (only for signup) */}
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="border-none outline-none ring-0 text-sm w-full"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="flex items-center w-full mt-4 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="border-none outline-none ring-0 text-sm w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0 text-sm w-full"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 mb-3 w-full h-11 rounded-full text-white bg-[#FF8040] hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading
            ? state === "login"
              ? "Logging in..."
              : "Signing up..."
            : state === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        {/* Switch login <-> signup */}
        <p className="text-gray-500 text-sm mb-11">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={toggleState}
            className="text-[#FF8040] hover:underline font-medium"
          >
            Click here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;

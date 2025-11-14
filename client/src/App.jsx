// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer"
import Home from "./pages/Home";
import Login from "./pages/Login";
import FeaturesPage from "./components/Features/FeaturePage";
import DoctorDetail from "./components/Home/DoctorsDetailsPage";

const App = () => {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login";
  const hideFooter = location.pathname === "/login";

  return (
    <div className={!hideNavbar ? "pt-14 sm:pt-20 md:pt-16" : ""}>
      {!hideNavbar && <Navbar />}

      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />

        </Routes>
      </Suspense>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;

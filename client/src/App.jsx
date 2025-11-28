// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import FeaturesPage from "./components/Features/FeaturePage";
import DoctorDetail from "./components/DoctorsDetailsPage";
import Doctors from "./pages/Doctors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import TermsPrivacy from "./pages/TermsPrivacy";

// Dashboards
import DoctorLayout from "./pages/DoctorLayout";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Appointments from "./components/Dashboard/Doctor/Appointments";
import Patients from "./components/Dashboard/Doctor/Patients";
import Reports from "./components/Dashboard/Doctor/Reports";
import Messages from "./components/Dashboard/Doctor/Messages";

// Onboarding pages
import PatientOnboarding from "./pages/PatientOnboarding";
import DoctorOnboarding from "./pages/DoctorOnboarding";

const App = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // auth + onboarding pages (hide navbar)
  const isAuthPage =
    path.startsWith("/login") || path.startsWith("/onboarding/");

  // doctor dashboard pages (hide footer)
  const isDoctorPage = path.startsWith("/dashboard/doctor");

  const hideNavbar = isAuthPage;
  const hideFooter = isAuthPage || isDoctorPage;

  const wrapperClass =
    !hideNavbar && !isDoctorPage ? "pt-14 sm:pt-20 md:pt-16" : "";

  return (
    <div className={wrapperClass}>
      {!hideNavbar && <Navbar />}

      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/helpcenter" element={<HelpCenter />} />
          <Route path="/terms&privacy" element={<TermsPrivacy />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />

          {/* Auth routes (role-aware Login page) */}
          {/* /login, /login/patient, /login/doctor etc will all render <Login /> */}
          <Route path="/login/*" element={<Login />} />

          {/* Onboarding routes */}
          <Route path="/onboarding/patient" element={<PatientOnboarding />} />
          <Route path="/onboarding/doctor" element={<DoctorOnboarding />} />

          {/* Doctor dashboard area */}
          <Route path="/dashboard/doctor" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="patients" element={<Patients />} />
            <Route path="reports" element={<Reports />} />
            <Route path="messages" element={<Messages />} />
          </Route>

          {/* Patient dashboard */}
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
        </Routes>
      </Suspense>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;

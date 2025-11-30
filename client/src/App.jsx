// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import FeaturesPage from "./components/Features/FeaturePage";
import Doctors from "./pages/Doctors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import TermsPrivacy from "./pages/TermsPrivacy";

// Dashboards
import DoctorLayout from "./pages/Doctor/DoctorLayout";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import PatientDashboard from "./pages/Patient/PatientDashboard";

// Onboarding pages
import PatientOnboarding from "./pages/Patient/PatientOnboarding";
import DoctorOnboarding from "./pages/Doctor/DoctorOnboarding";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import DoctorRegister from "./pages/Doctor/DoctorRegister";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancel";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import PatientAppointments from "./pages/Patient/PatientAppointments";
import DoctorEarnings from "./pages/Doctor/DoctorEarning";
import PatientDoctor from "./pages/Patient/PatientDoctor";
import PatientBilling from "./pages/Patient/PatientBilling";
import DoctorPatient from "./pages/Doctor/DoctorPatient";
import DoctorDetailsPage from "./components/DoctorsDetailsPage";
import ChatPage from "./pages/ChatAndVideoCall/ChatPage";
import VideoCallPage from "./pages/ChatAndVideoCall/VideoCallPage";

// 🔹 Credits / plans & summary
import PlansPage from "./pages/PlansPage";
import NewSummaryPage from "./pages/NewSummaryPage";

// 🔹 NEW: public shared-report view
import SharedReportPage from "./pages/SharedReportPage";

const App = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const isAuthPage =
    path.startsWith("/login") || path.startsWith("/onboarding/");
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
          <Route path="/doctor/:id" element={<DoctorDetailsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route path="/videoCall" element={<VideoCallPage />} />
          <Route path="/chat" element={<ChatPage />} />

          {/* 🔹 Plans route */}
          <Route path="/plans" element={<PlansPage />} />

          {/* 🔹 NEW: public shared report route (no auth) */}
          <Route path="/share/:shareId" element={<SharedReportPage />} />

          {/* Auth routes */}
          <Route path="/login/*" element={<Login />} />

          {/* Onboarding routes */}
          <Route path="/onboarding/patient" element={<PatientOnboarding />} />
          <Route path="/onboarding/doctor" element={<DoctorOnboarding />} />

          {/* Patient dashboard area */}
          <Route
            path="/dashboard/patient/appointments"
            element={<PatientAppointments />}
          />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/doctors" element={<PatientDoctor />} />
          <Route path="/patient/summary" element={<NewSummaryPage />} />
          <Route path="/patient/billing" element={<PatientBilling />} />
          <Route path="/patient/plans" element={<PlansPage />} />

          {/* Doctor dashboard area */}
          <Route path="/dashboard/doctor" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="earnings" element={<DoctorEarnings />} />
            <Route path="patients" element={<DoctorPatient />} />
          </Route>
        </Routes>
      </Suspense>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;

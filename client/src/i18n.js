import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Navbar
import enNavbar from "./locales/en/navbar.json";
import hiNavbar from "./locales/hi/navbar.json";
import mrNavbar from "./locales/mr/navbar.json";

// Hero
import enHero from "./locales/en/hero.json";
import hiHero from "./locales/hi/hero.json";
import mrHero from "./locales/mr/hero.json";

// Home Features
import enFeatures from "./locales/en/homefeatures.json";
import hiFeatures from "./locales/hi/homefeatures.json";
import mrFeatures from "./locales/mr/homefeatures.json";

// Meet Doctors (home section)
import enDoctors from "./locales/en/meetdoctors.json";
import hiDoctors from "./locales/hi/meetdoctors.json";
import mrDoctors from "./locales/mr/meetdoctors.json";

// About
import enAbout from "./locales/en/aboutsystem.json";
import hiAbout from "./locales/hi/aboutsystem.json";
import mrAbout from "./locales/mr/aboutsystem.json";

// Dashboard
import enDashboard from "./locales/en/dashboardoverview.json";
import hiDashboard from "./locales/hi/dashboardoverview.json";
import mrDashboard from "./locales/mr/dashboardoverview.json";

// Benefits
import enBenefits from "./locales/en/benefits.json";
import hiBenefits from "./locales/hi/benefits.json";
import mrBenefits from "./locales/mr/benefits.json";

// Get Started
import enGetStarted from "./locales/en/getstarted.json";
import hiGetStarted from "./locales/hi/getstarted.json";
import mrGetStarted from "./locales/mr/getstarted.json";

// Footer
import enFooter from "./locales/en/footer.json";
import hiFooter from "./locales/hi/footer.json";
import mrFooter from "./locales/mr/footer.json";

// Find Doctors page
import enFindDoctors from "./locales/en/finddoctors.json";
import hiFindDoctors from "./locales/hi/finddoctors.json";
import mrFindDoctors from "./locales/mr/finddoctors.json";

// Features page
import enFeaturesPage from "./locales/en/featurespage.json";
import hiFeaturesPage from "./locales/hi/featurespage.json";
import mrFeaturesPage from "./locales/mr/featurespage.json";

// About us Page
import enAboutPage from "./locales/en/aboutpage.json";
import hiAboutPage from "./locales/hi/aboutpage.json";
import mrAboutPage from "./locales/mr/aboutpage.json";

// Contact us Page
import enContact from "./locales/en/contact.json";
import hiContact from "./locales/hi/contact.json";
import mrContact from "./locales/mr/contact.json";

// Patient Dashboard
import enPatientDashboard from "./locales/en/patientdashboard.json";
import hiPatientDashboard from "./locales/hi/patientdashboard.json";
import mrPatientDashboard from "./locales/mr/patientdashboard.json";

// Patient Doctor
import enPatientDoctor from "./locales/en/patientdoctor.json";
import hiPatientDoctor from "./locales/hi/patientdoctor.json";
import mrPatientDoctor from "./locales/mr/patientdoctor.json";

// Patient Appointments
import enPatientAppointments from "./locales/en/patientappointments.json";
import hiPatientAppointments from "./locales/hi/patientappointments.json";
import mrPatientAppointments from "./locales/mr/patientappointments.json";

// Patient Summary
import enSummary from "./locales/en/summary.json";
import hiSummary from "./locales/hi/summary.json";
import mrSummary from "./locales/mr/summary.json";

// Patient Billing
import enBilling from "./locales/en/billing.json";
import hiBilling from "./locales/hi/billing.json";
import mrBilling from "./locales/mr/billing.json";

// Patient Billings
import enPlans from "./locales/en/plans.json";
import hiPlans from "./locales/hi/plans.json";
import mrPlans from "./locales/mr/plans.json";

// Profile page
import enProfile from "./locales/en/profile.json";
import hiProfile from "./locales/hi/profile.json";
import mrProfile from "./locales/mr/profile.json";

// Settings account section
import enAccount from "./locales/en/account.json";
import hiAccount from "./locales/hi/account.json";
import mrAccount from "./locales/mr/account.json";

// Settings password section
import enPassword from "./locales/en/password.json";
import hiPassword from "./locales/hi/password.json";
import mrPassword from "./locales/mr/password.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        navbar: enNavbar,
        hero: enHero,
        features: enFeatures,
        doctors: enDoctors,
        about: enAbout,
        dashboard: enDashboard,
        benefits: enBenefits,
        getstarted: enGetStarted,
        footer: enFooter,
        finddoctors: enFindDoctors,
        featurespage: enFeaturesPage,
        aboutpage: enAboutPage,
        contact: enContact,
        patientdashboard: enPatientDashboard,
        patientdoctor: enPatientDoctor,
        patientappointments: enPatientAppointments,
        summary: enSummary,
        billing: enBilling,
        plans: enPlans,
        profile: enProfile,
        account: enAccount,
        password: enPassword



      },
      hi: {
        navbar: hiNavbar,
        hero: hiHero,
        features: hiFeatures,
        doctors: hiDoctors,
        about: hiAbout,
        dashboard: hiDashboard,
        benefits: hiBenefits,
        getstarted: hiGetStarted,
        footer: hiFooter,
        finddoctors: hiFindDoctors,
        featurespage: hiFeaturesPage,
        aboutpage: hiAboutPage,
        contact: hiContact,
        patientdashboard: hiPatientDashboard,
        patientdoctor: hiPatientDoctor,
        patientappointments: hiPatientAppointments,
        summary: hiSummary,
        billing: hiBilling,
        plans: hiPlans,
        profile: hiProfile,
        account: hiAccount,
        password: hiPassword




      },
      mr: {
        navbar: mrNavbar,
        hero: mrHero,
        features: mrFeatures,
        doctors: mrDoctors,
        about: mrAbout,
        dashboard: mrDashboard,
        benefits: mrBenefits,
        getstarted: mrGetStarted,
        footer: mrFooter,
        finddoctors: mrFindDoctors,
        featurespage: mrFeaturesPage,
        aboutpage: mrAboutPage,
        contact: mrContact,
        patientdashboard: mrPatientDashboard,
        patientdoctor: mrPatientDoctor,
        patientappointments: mrPatientAppointments,
        summary: mrSummary,
        billing: mrBilling,
        plans: mrPlans,
        profile: mrProfile,
        account: mrAccount,
        password: mrPassword




      },
    },

    fallbackLng: "en",

    ns: [
      "navbar",
      "hero",
      "features",
      "doctors",
      "about",
      "dashboard",
      "benefits",
      "getstarted",
      "footer",
      "finddoctors",
      "featurespage",
      "aboutpage",
      "contact",
      "patientdashboard",
      "patientdoctor",
      "patientappointments",
      "billing",
      "profile",
      "account",
      "password"



    ],

    defaultNS: "navbar",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

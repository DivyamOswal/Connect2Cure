import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Navbar
import enNavbar from "./locales/en/navbar.json";
import hiNavbar from "./locales/hi/navbar.json";
import mrNavbar from "./locales/mr/navbar.json";
import guNavbar from "./locales/gu/navbar.json";
import taNavbar from "./locales/ta/navbar.json";
import teNavbar from "./locales/te/navbar.json";

// Hero
import enHero from "./locales/en/hero.json";
import hiHero from "./locales/hi/hero.json";
import mrHero from "./locales/mr/hero.json";
import guHero from "./locales/gu/hero.json";
import taHero from "./locales/ta/hero.json";
import teHero from "./locales/te/hero.json";

// Home Features
import enFeatures from "./locales/en/homefeatures.json";
import hiFeatures from "./locales/hi/homefeatures.json";
import mrFeatures from "./locales/mr/homefeatures.json";
import guFeatures from "./locales/gu/homefeatures.json";
import taFeatures from "./locales/ta/homefeatures.json";
import teFeatures from "./locales/te/homefeatures.json";

// Meet Doctors (home section)
import enDoctors from "./locales/en/meetdoctors.json";
import hiDoctors from "./locales/hi/meetdoctors.json";
import mrDoctors from "./locales/mr/meetdoctors.json";
import guDoctors from "./locales/gu/meetdoctors.json";
import taDoctors from "./locales/ta/meetdoctors.json";
import teDoctors from "./locales/te/meetdoctors.json";

// About
import enAbout from "./locales/en/aboutsystem.json";
import hiAbout from "./locales/hi/aboutsystem.json";
import mrAbout from "./locales/mr/aboutsystem.json";
import guAbout from "./locales/gu/aboutsystem.json";
import taAbout from "./locales/ta/aboutsystem.json";
import teAbout from "./locales/te/aboutsystem.json";

// Dashboard
import enDashboard from "./locales/en/dashboardoverview.json";
import hiDashboard from "./locales/hi/dashboardoverview.json";
import mrDashboard from "./locales/mr/dashboardoverview.json";
import guDashboard from "./locales/gu/dashboardoverview.json";
import taDashboard from "./locales/ta/dashboardoverview.json";
import teDashboard from "./locales/te/dashboardoverview.json";


// Benefits
import enBenefits from "./locales/en/benefits.json";
import hiBenefits from "./locales/hi/benefits.json";
import mrBenefits from "./locales/mr/benefits.json";
import guBenefits from "./locales/gu/benefits.json";
import taBenefits from "./locales/ta/benefits.json";
import teBenefits from "./locales/te/benefits.json";

// Get Started
import enGetStarted from "./locales/en/getstarted.json";
import hiGetStarted from "./locales/hi/getstarted.json";
import mrGetStarted from "./locales/mr/getstarted.json";
import guGetStarted from "./locales/gu/getstarted.json";
import taGetStarted from "./locales/ta/getstarted.json";
import teGetStarted from "./locales/te/getstarted.json";

// Footer
import enFooter from "./locales/en/footer.json";
import hiFooter from "./locales/hi/footer.json";
import mrFooter from "./locales/mr/footer.json";
import guFooter from "./locales/gu/footer.json";
import taFooter from "./locales/ta/footer.json";
import teFooter from "./locales/te/footer.json";

// Find Doctors page
import enFindDoctors from "./locales/en/finddoctors.json";
import hiFindDoctors from "./locales/hi/finddoctors.json";
import mrFindDoctors from "./locales/mr/finddoctors.json";
import guFindDoctors from "./locales/gu/finddoctors.json";
import taFindDoctors from "./locales/ta/finddoctors.json";
import teFindDoctors from "./locales/te/finddoctors.json";

// Features page
import enFeaturesPage from "./locales/en/featurespage.json";
import hiFeaturesPage from "./locales/hi/featurespage.json";
import mrFeaturesPage from "./locales/mr/featurespage.json";
import guFeaturesPage from "./locales/gu/featurespage.json";
import taFeaturesPage from "./locales/ta/featurespage.json";
import teFeaturesPage from "./locales/te/featurespage.json";


// About us Page
import enAboutPage from "./locales/en/aboutpage.json";
import hiAboutPage from "./locales/hi/aboutpage.json";
import mrAboutPage from "./locales/mr/aboutpage.json";
import guAboutPage from "./locales/gu/aboutpage.json";
import taAboutPage from "./locales/ta/aboutpage.json";
import teAboutPage from "./locales/te/aboutpage.json";

// Contact us Page
import enContact from "./locales/en/contact.json";
import hiContact from "./locales/hi/contact.json";
import mrContact from "./locales/mr/contact.json";
import guContact from "./locales/gu/contact.json";
import taContact from "./locales/ta/contact.json";
import teContact from "./locales/te/contact.json";

// Patient Dashboard
import enPatientDashboard from "./locales/en/patientdashboard.json";
import hiPatientDashboard from "./locales/hi/patientdashboard.json";
import mrPatientDashboard from "./locales/mr/patientdashboard.json";
import guPatientDashboard from "./locales/gu/patientdashboard.json";
import taPatientDashboard from "./locales/ta/patientdashboard.json";
import tePatientDashboard from "./locales/te/patientdashboard.json";

// Patient Doctor
import enPatientDoctor from "./locales/en/patientdoctor.json";
import hiPatientDoctor from "./locales/hi/patientdoctor.json";
import mrPatientDoctor from "./locales/mr/patientdoctor.json";
import guPatientDoctor from "./locales/gu/patientdoctor.json";
import taPatientDoctor from "./locales/ta/patientdoctor.json";
import tePatientDoctor from "./locales/te/patientdoctor.json";

// Patient Appointments
import enPatientAppointments from "./locales/en/patientappointments.json";
import hiPatientAppointments from "./locales/hi/patientappointments.json";
import mrPatientAppointments from "./locales/mr/patientappointments.json";
import guPatientAppointments from "./locales/gu/patientappointments.json";
import taPatientAppointments from "./locales/ta/patientappointments.json";
import tePatientAppointments from "./locales/te/patientappointments.json";

// Patient Summary
import enSummary from "./locales/en/summary.json";
import hiSummary from "./locales/hi/summary.json";
import mrSummary from "./locales/mr/summary.json";
import guSummary from "./locales/gu/summary.json";
import taSummary from "./locales/ta/summary.json";
import teSummary from "./locales/te/summary.json";

// Patient Billing
import enBilling from "./locales/en/billing.json";
import hiBilling from "./locales/hi/billing.json";
import mrBilling from "./locales/mr/billing.json";
import guBilling from "./locales/gu/billing.json";
import taBilling from "./locales/ta/billing.json";
import teBilling from "./locales/te/billing.json";

// Patient Billings
import enPlans from "./locales/en/plans.json";
import hiPlans from "./locales/hi/plans.json";
import mrPlans from "./locales/mr/plans.json";
import guPlans from "./locales/gu/plans.json";
import taPlans from "./locales/ta/plans.json";
import tePlans from "./locales/te/plans.json";


// Profile page
import enProfile from "./locales/en/profile.json";
import hiProfile from "./locales/hi/profile.json";
import mrProfile from "./locales/mr/profile.json";
import guProfile from "./locales/gu/profile.json";
import taProfile from "./locales/ta/profile.json";
import teProfile from "./locales/te/profile.json";


// Settings account section
import enAccount from "./locales/en/account.json";
import hiAccount from "./locales/hi/account.json";
import mrAccount from "./locales/mr/account.json";
import guAccount from "./locales/gu/account.json";
import taAccount from "./locales/ta/account.json";
import teAccount from "./locales/te/account.json";

// Settings password section
import enPassword from "./locales/en/password.json";
import hiPassword from "./locales/hi/password.json";
import mrPassword from "./locales/mr/password.json";
import guPassword from "./locales/gu/password.json";
import taPassword from "./locales/ta/password.json";
import tePassword from "./locales/te/password.json";

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

      gu: {
    navbar: guNavbar,
    hero: guHero,
    features: guFeatures,
    doctors: guDoctors,
    about: guAbout,
    dashboard: guDashboard,
    benefits: guBenefits,
    getstarted: guGetStarted,
    footer: guFooter,
    finddoctors: guFindDoctors,
    featurespage: guFeaturesPage,
    aboutpage: guAboutPage,
    contact: guContact,
    patientdashboard: guPatientDashboard,
    patientdoctor: guPatientDoctor,
    patientappointments: guPatientAppointments,
    summary: guSummary,
    billing: guBilling,
    plans: guPlans,
    profile: guProfile,
    account: guAccount,
    password: guPassword
  },

  ta: {
    navbar: taNavbar,
    hero: taHero,
    features: taFeatures,
    doctors: taDoctors,
    about: taAbout,
    dashboard: taDashboard,
    benefits: taBenefits,
    getstarted: taGetStarted,
    footer: taFooter,
    finddoctors: taFindDoctors,
    featurespage: taFeaturesPage,
    aboutpage: taAboutPage,
    contact: taContact,
    patientdashboard: taPatientDashboard,
    patientdoctor: taPatientDoctor,
    patientappointments: taPatientAppointments,
    summary: taSummary,
    billing: taBilling,
    plans: taPlans,
    profile: taProfile,
    account: taAccount,
    password: taPassword
  },

  te: {
    navbar: teNavbar,
    hero: teHero,
    features: teFeatures,
    doctors: teDoctors,
    about: teAbout,
    dashboard: teDashboard,
    benefits: teBenefits,
    getstarted: teGetStarted,
    footer: teFooter,
    finddoctors: teFindDoctors,
    featurespage: teFeaturesPage,
    aboutpage: teAboutPage,
    contact: teContact,
    patientdashboard: tePatientDashboard,
    patientdoctor: tePatientDoctor,
    patientappointments: tePatientAppointments,
    summary: teSummary,
    billing: teBilling,
    plans: tePlans,
    profile: teProfile,
    account: teAccount,
    password: tePassword
  }
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
      "plans",
      "summary",
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

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Navbar translations
import enNavbar from "./locales/en/navbar.json";
import hiNavbar from "./locales/hi/navbar.json";
import mrNavbar from "./locales/mr/navbar.json";

// Hero translations
import enHero from "./locales/en/hero.json";
import hiHero from "./locales/hi/hero.json";
import mrHero from "./locales/mr/hero.json";

// Home Features translations
import enFeatures from "./locales/en/homefeatures.json";
import hiFeatures from "./locales/hi/homefeatures.json";
import mrFeatures from "./locales/mr/homefeatures.json";

// Meet Doctors translations
import enDoctors from "./locales/en/meetdoctors.json";
import hiDoctors from "./locales/hi/meetdoctors.json";
import mrDoctors from "./locales/mr/meetdoctors.json";

// About System translations
import enAbout from "./locales/en/aboutsystem.json";
import hiAbout from "./locales/hi/aboutsystem.json";
import mrAbout from "./locales/mr/aboutsystem.json";

// Dashboard Overview translations
import enDashboard from "./locales/en/dashboardoverview.json";
import hiDashboard from "./locales/hi/dashboardoverview.json";
import mrDashboard from "./locales/mr/dashboardoverview.json";

// ✅ Benefits translations (THIS WAS MISSING)
import enBenefits from "./locales/en/benefits.json";
import hiBenefits from "./locales/hi/benefits.json";
import mrBenefits from "./locales/mr/benefits.json";

import enGetStarted from "./locales/en/getstarted.json";
import hiGetStarted from "./locales/hi/getstarted.json";
import mrGetStarted from "./locales/mr/getstarted.json";

import enFooter from "./locales/en/footer.json";
import hiFooter from "./locales/hi/footer.json";
import mrFooter from "./locales/mr/footer.json";



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
        footer: enFooter
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
        footer: hiFooter
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
        footer: mrFooter
      }
    },

    fallbackLng: "en",

    // ALL namespaces used in the app
    ns: [
  "navbar",
  "hero",
  "features",
  "doctors",
  "about",
  "dashboard",
  "benefits",
  "getstarted",
  "footer"
],


    // Default namespace
    defaultNS: "navbar",

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

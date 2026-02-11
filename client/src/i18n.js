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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        navbar: enNavbar,
        hero: enHero,
        features: enFeatures
      },
      hi: {
        navbar: hiNavbar,
        hero: hiHero,
        features: hiFeatures
      },
      mr: {
        navbar: mrNavbar,
        hero: mrHero,
        features: mrFeatures
      }
    },

    fallbackLng: "en",

    // ALL namespaces used in the app
    ns: ["navbar", "hero", "features"],

    // Default namespace (Navbar uses this)
    defaultNS: "navbar",

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

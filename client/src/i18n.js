import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enNavbar from "./locales/en/navbar.json";
import hiNavbar from "./locales/hi/navbar.json";
import mrNavbar from "./locales/mr/navbar.json";
import enHero from "./locales/en/hero.json";
import hiHero from "./locales/hi/hero.json";
import mrHero from "./locales/mr/hero.json";


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        navbar: enNavbar,
        hero: enHero
      },
      hi: {
        navbar: hiNavbar,
        hero: hiHero
      },
      mr: {
        navbar: mrNavbar,
        hero: mrHero
      }
    },
    fallbackLng: "en",
    ns: ["navbar", "hero"],
    defaultNS: "navbar",
    interpolation: { escapeValue: false }
  });


export default i18n;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enNavbar from "./locales/en/navbar.json";
import hiNavbar from "./locales/hi/navbar.json";
import mrNavbar from "./locales/mr/navbar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { navbar: enNavbar },
      hi: { navbar: hiNavbar },
      mr: { navbar: mrNavbar }
    },
    fallbackLng: "en",
    ns: ["navbar"],
    defaultNS: "navbar",
    interpolation: { escapeValue: false }
  });

export default i18n;

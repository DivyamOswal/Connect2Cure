import React from "react";
import icons from "./Footer/footer.js";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("footer");

  return (
    <div>
      <footer className="bg-[#b5b1b1] text-black px-6 py-8 md:px-12 lg:px-20">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:justify-between gap-8">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-xl font-bold">Connect2Cure</h2>
            <p className="text-sm mt-2">
              {t("description")}
            </p>

            <div className="flex gap-4 pt-4">
              {icons.map((icon, index) => (
                <a
                  key={index}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={icon.image}
                    alt={`social-icon-${index}`}
                    className="w-5 h-5 cursor-pointer hover:opacity-70 transition"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-2">{t("sections.explore")}</h3>
              <ul className="space-y-1">
                <li><Link to="/doctors">{t("links.doctors")}</Link></li>
                <li><Link to="/features">{t("links.features")}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("sections.company")}</h3>
              <ul className="space-y-1">
                <li><Link to="/about">{t("links.about")}</Link></li>
                <li><Link to="/contact">{t("links.contact")}</Link></li>
                <li><Link to="/login">{t("links.login")}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("sections.support")}</h3>
              <ul className="space-y-1">
                <li><a href="/faq">{t("links.faq")}</a></li>
                <li><a href="/helpcenter">{t("links.help")}</a></li>
                <li><a href="/terms&privacy">{t("links.terms")}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("sections.socials")}</h3>
              <ul className="space-y-1">
                <li><a href="https://www.instagram.com">Instagram</a></li>
                <li><a href="https://www.facebook.com">Facebook</a></li>
                <li><a href="https://www.twitter.com">Twitter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <div className="border-t border-black/30 pt-4 pb-6 text-center text-xs sm:text-sm bg-[#D4D0D0]">
        <p className="px-4 sm:px-0">
          {t("companyInfo")}
        </p>
        <p className="mt-2 px-4 sm:px-0">
          © 1996–{new Date().getFullYear()} Connect2Cure. {t("rights")}
        </p>
      </div>
    </div>
  );
};

export default Footer;

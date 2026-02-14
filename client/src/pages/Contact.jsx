import React, { useEffect } from "react";
import img1 from "../assets/Contact/contact-img.jpg";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation("contact");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-[#E6E6E6] px-6 py-7">
      <div className="max-w-[1200px] mx-auto">
        {/* Heading */}
        <h1 className="text-center text-3xl md:text-4xl font-semibold text-gray-800">
          {t("heading", { defaultValue: "Contact Us" })}
        </h1>

        <p className="text-center text-gray-700 mt-3 text-base md:text-lg leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Main content */}
        <div className="flex flex-col md:flex-row items-center gap-10 mt-12">
          <img
            src={img1}
            alt={t("imageAlt")}
            className="sm:hidden md:block md:h-[350px] md:w-[500px] rounded-xl object-cover shadow-md"
          />

          {/* Contact Form */}
          <div className="flex-1 bg-white p-4 rounded-xl shadow-md w-full">
            <form className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  {t("form.nameLabel")}
                </label>
                <input
                  type="text"
                  placeholder={t("form.namePlaceholder")}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  {t("form.emailLabel")}
                </label>
                <input
                  type="email"
                  placeholder={t("form.emailPlaceholder")}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  {t("form.messageLabel")}
                </label>
                <textarea
                  placeholder={t("form.messagePlaceholder")}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
                />
              </div>

              <button
                type="submit"
                className="text-white bg-[#FF8040] font-semibold py-2.5 rounded-lg hover:bg-black transition-colors duration-300"
              >
                {t("form.submit")}
              </button>
            </form>

            {/* Contact info */}
            <div className="mt-8 text-gray-700 text-sm">
              <p>{t("info.address")}</p>
              <p>{t("info.phone")}</p>
              <p>{t("info.email")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

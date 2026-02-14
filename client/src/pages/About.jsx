import React, { useEffect } from "react";
import img1 from "../assets/About/img-1.png";
import img2 from "../assets/About/img-2.png";
import img3 from "../assets/About/img-3.avif";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation("aboutpage");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-[#E6E6E6] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">

        {/* Heading */}
        <h1 className="text-center text-3xl md:text-4xl font-semibold text-gray-800">
          {t("heading", { defaultValue: "About Us" })}
        </h1>

        <p className="text-center text-gray-700 mt-3 text-base md:text-lg leading-relaxed">
          {t("intro")}
        </p>

        {/* Section 1 */}
        <div className="flex flex-col md:flex-row items-center gap-8 mt-12">
          <img
            src={img1}
            alt={t("section1.imageAlt")}
            className="h-[300px] md:h-[350px] w-full md:w-[500px] rounded-xl object-cover shadow-md"
          />

          <div className="flex-1 text-gray-800">
            <h3 className="text-xl font-semibold mb-3 text-[#FF8040]">
              {t("section1.title")}
            </h3>
            <p className="text-base leading-relaxed">
              {t("section1.content")}
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col md:flex-row items-center gap-8 mt-20">
          <div className="flex-1 text-gray-800">
            <h3 className="text-xl font-semibold mb-3 text-[#FF8040]">
              {t("section2.title")}
            </h3>

            <p>{t("section2.items.consultations")}</p>
            <p>{t("section2.items.specialists")}</p>
            <p>{t("section2.items.records")}</p>
            <p>{t("section2.items.reminders")}</p>
          </div>

          <img
            src={img2}
            alt={t("section2.imageAlt")}
            className="h-[300px] md:h-[350px] w-full md:w-[500px] rounded-xl object-cover shadow-md"
          />
        </div>

        {/* Section 3 */}
        <div className="flex flex-col md:flex-row items-center gap-8 mt-20">
          <img
            src={img3}
            alt={t("section3.imageAlt")}
            className="h-[300px] md:h-[350px] w-full md:w-[500px] rounded-xl object-cover shadow-md"
          />

          <div className="flex-1 text-gray-800">
            <h3 className="text-xl font-semibold mb-3 text-[#FF8040]">
              {t("section3.title")}
            </h3>

            <p>{t("section3.points.one")}</p>
            <p>{t("section3.points.two")}</p>
            <p>{t("section3.points.three")}</p>
            <p>{t("section3.points.four")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

import React, { useState } from "react";
import faqData from "../assets/FAQ/faqData";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-[#E6E6E6] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              onClick={() => toggleFAQ(index)}
              className={`
                rounded-lg shadow p-4 cursor-pointer transition-all
                ${activeIndex === index ? "bg-[#f4e1d6] border border-dotted border-[#FF8040] " : "bg-white"}
              `}
            >
              {/* Question Row */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {faq.question}
                </h3>
                <span className="text-2xl font-bold rotate-360">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>

              {/* Answer */}
              {activeIndex === index && (
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

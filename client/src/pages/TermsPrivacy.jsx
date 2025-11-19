import React from "react";
import Title from "../components/Title";

const TermsPrivacy = () => {
  return (
     <section className="bg-[#E6E6E6] px-6 py-7">
      <div className="max-w-[1275px] mx-auto">
        <Title title='Terms & Privacy' subtitle=' Please read these terms and privacy details carefully.'/>
        <div className="bg-white border rounded-lg shadow-sm p-6 space-y-8 mt-6">

          {/* Terms of Service */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Terms of Service
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              By using our service, you agree to follow our terms of service. You must
              use the platform responsibly and follow all applicable laws. 
            </p>

            <ul className="list-disc ml-6 mt-3 text-gray-700 text-sm space-y-1">
              <li>Do not misuse or interfere with the platform.</li>
              <li>Your account information must be accurate and secure.</li>
              <li>You must not attempt unauthorized access to the system.</li>
            </ul>

            <p className="text-gray-700 text-sm mt-3 leading-relaxed">
              These terms may be updated at any time. Continued use of the platform
              means you accept any new changes.
            </p>
          </section>

          <hr />

          {/* Privacy Policy */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Privacy Policy
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Your privacy is very important to us. We only collect the necessary
              data required to provide our services and improve user experience.
            </p>

            <h3 className="text-sm font-semibold text-gray-800 mt-4">What we collect:</h3>
            <ul className="list-disc ml-6 mt-2 text-gray-700 text-sm space-y-1">
              <li>Basic profile details (name, email, etc.)</li>
              <li>Activity logs to improve platform performance</li>
              <li>Optional health-related data (if you choose to provide it)</li>
            </ul>

            <h3 className="text-sm font-semibold text-gray-800 mt-4">How we use your data:</h3>
            <ul className="list-disc ml-6 mt-2 text-gray-700 text-sm space-y-1">
              <li>To deliver platform features and improve our service</li>
              <li>To personalize your user experience</li>
              <li>To communicate updates or support information</li>
            </ul>

            <p className="text-gray-700 text-sm mt-3 leading-relaxed">
              We never sell your information to third parties. Data is handled 
              following industry-standard security guidelines.
            </p>

            <p className="text-gray-700 text-sm mt-3 leading-relaxed">
              You can request an account deletion or data export at any time by 
              contacting our support team.
            </p>
          </section>

          <hr />

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Contact Information
            </h2>
            <p className="text-gray-700 text-sm">
              If you have questions regarding these Terms or our Privacy practices,
              reach out to our support team.
            </p>

            <a
              href="mailto:Connect2Cure.support@example.com"
              className="text-[#FF8040] text-sm mt-3 inline-block hover:underline"
            >
              Connect2Cure.support@example.com
            </a>
          </section>
          </div>
        </div>
        </section>
  );
};

export default TermsPrivacy;

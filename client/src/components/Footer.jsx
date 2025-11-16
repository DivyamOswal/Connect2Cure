import React from 'react'
import icons from './Footer/footer.js';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
   <div>
      <footer className="bg-[#b5b1b1] text-black px-6 py-8 md:px-12 lg:px-20">
      {/* Top Section */}
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:justify-between gap-8">
        {/* Brand / Logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-xl font-bold">Connect2Cure</h2>
          <p className="text-sm mt-2">
            Your one-stop solution for patient care, appointments, and medical records.
          </p>
          {/* Social Icons */}
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

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center md:text-left">
          <div>
            <h3 className="font-semibold mb-2">Explore</h3>
            <ul className="space-y-1">
              <li><Link to="/doctors" className="hover:underline hover:text-[#FF8040]">Doctors</Link></li>
              <li><Link to="/features" className="hover:underline hover:text-[#FF8040]">Features</Link></li>
              <li><Link to="/pricing" className="hover:underline hover:text-[#FF8040]">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Company</h3>
            <ul className="space-y-1">
              <li><Link to="/about" className="hover:underline hover:text-[#FF8040]">About</Link></li>
              <li><Link to="/contact" className="hover:underline hover:text-[#FF8040]">Contact</Link></li>
              <li><Link to="/login" className="hover:underline hover:text-[#FF8040]">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <ul className="space-y-1">
              <li><a href="/faq" className="hover:underline hover:text-[#FF8040]">FAQ</a></li>
              <li><a href="/helpcenter" className="hover:underline hover:text-[#FF8040]">Help Center</a></li>
              <li><a href="/terms&privacy" className="hover:underline hover:text-[#FF8040]">Terms & Privacy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Socials</h3>
            <ul className="space-y-1">
              <li><a href="https://www.instagram.com" className="hover:underline hover:text-[#FF8040]">Instagram</a></li>
              <li><a href="https://www.facebook.com" className="hover:underline hover:text-[#FF8040]">Facebook</a></li>
              <li><a href="https://www.twitter.com" className="hover:underline hover:text-[#FF8040]">Twitter</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
    
    </footer>
     <div className="border-t border-black/30 pt-4 pb-6 text-center text-xs sm:text-sm bg-[#D4D0D0]">
  {/* Company Info */}
  <p className="px-4 sm:px-0">
  Connect2Cure is part of Connect2Cure HealthTech Solutions, a leading provider of digital healthcare and patient management services.
</p>


  {/* Copyright */}
  <p className="mt-2 px-4 sm:px-0">
    Copyright © 1996–{new Date().getFullYear()} Connect2Cure. All rights
    reserved.
  </p>

</div>

    </div>
  );
};


export default Footer
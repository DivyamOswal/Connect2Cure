import React, { useEffect } from 'react'
import img1 from "../assets/Contact/contact-img.jpg";


const Contact = () => {
    useEffect(()=>{
      window.scrollTo({top:0, behavior:"smooth"})
    },[])
  return (
    <section className="bg-[#E6E6E6] px-6 py-7">
      <div className="max-w-[1200px] mx-auto">
        {/* Heading */}
        <h1 className="text-center text-3xl md:text-4xl font-semibold text-gray-800">
          Contact Us
        </h1>
        <p className="text-center text-gray-700 mt-3 text-base md:text-lg leading-relaxed">
          We’re here to help you find your perfect stay. Whether you have a
          booking query, partnership proposal, or feedback we’d love to hear
          from you.
        </p>

        {/* Main content */}
        <div className="flex flex-col md:flex-row items-center gap-10 mt-12">
          {/* Image — hidden on mobile */}
          <img
            src={img1}
            alt="EaseWithStay"
            className="sm:hidden md:block md:h-[350px] md:w-[500px] rounded-xl object-cover shadow-md"
          />

          {/* Contact Form */}
          <div className="flex-1 bg-white p-4 md:p- rounded-xl shadow-md w-full">
            <form className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Message
                </label>
                <textarea
                  placeholder="Write your message..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
                />
              </div>

              <button
                type="submit"
                className=" text-white bg-[#FF8040] font-semibold py-2.5 rounded-lg hover:bg-black transition-colors duration-300"
              >
                Send Message
              </button>
            </form>

            {/* Contact info section */}
            <div className="mt-8 text-gray-700 text-sm">
              <p>
                📍 <span className="font-medium">Address:</span> 123 Beach Road,
                Goa, India
              </p>
              <p>
                📞 <span className="font-medium">Phone:</span> +91 98765 43210
              </p>
              <p>
                ✉️ <span className="font-medium">Email:</span>{" "}
                support@easewithstay.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
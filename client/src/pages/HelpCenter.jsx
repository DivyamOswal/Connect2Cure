import React, { useState } from 'react'
import Title from '../components/Title'
import helpCenterData from '../assets/HelpCenter/helpcenter';
import { Link } from 'react-router-dom';


const HelpCenter = () => {
   
  const [query, setQuery] = useState("");

  const filtered = helpCenterData.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <section className="bg-[#E6E6E6] px-6 py-7">
      <div className="max-w-[1275px] mx-auto">
        <Title title='Help Center' subtitle=' Browse help topics or search below.'/>
        <input
          type="text"
          placeholder="Search help topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mb-8 mt-4 shadow-sm focus:ring-2 focus:ring-[#FF8040] outline-none"
        />

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {item.description}
                </p>
                <Link
                  to={item.link}
                  className="text-[#FF8040] text-sm mt-3 inline-block hover:underline"
                >
                  Learn more →
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No topics found.</p>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Need more help?</h2>
          <p className="text-gray-600 mt-2">
            If your question isn’t answered, feel free to reach out to our support team.
          </p>
          <Link to='/contact'>
          <button className="mt-4 px-5 py-2 bg-[#FF8040] text-white rounded-lg hover:bg-[#FF8040]/95">
            Contact Support
          </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HelpCenter
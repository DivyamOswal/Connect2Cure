import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const getDoctorImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const origin = import.meta.env.VITE_BACKEND_ORIGIN;
  return `${origin}${imagePath}`;
};


const BookingModal = ({ doctor, onClose }) => {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.date || !form.time) {
      setError("Please fill name, phone, date and time.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/appointments/create-checkout-session", {
        doctorId: doctor._id,
        name: form.name,
        phone: form.phone,
        date: form.date,
        time: form.time,
      });

      if (!data?.url) {
        throw new Error("Checkout URL not returned from server.");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to start payment. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      {/* Modal container */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b">
          <h3 className="text-base sm:text-lg font-semibold">
            Book Appointment — {doctor.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 text-xl leading-none"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="px-4 py-4 sm:px-6 sm:py-6 space-y-4 overflow-y-auto"
        >
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Patient name"
              className="border rounded px-3 py-2 w-full text-sm sm:text-base"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border rounded px-3 py-2 w-full text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full text-sm sm:text-base"
            />
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#FF8040] text-white rounded hover:bg-black text-sm sm:text-base disabled:opacity-70"
            >
              {loading ? "Booking..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DoctorDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [openBooking, setOpenBooking] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const source = location.state?.source || null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    api
      .get(`/doctors/${id}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => {
        console.error("Failed to load doctor", err);
        setDoctor(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F3F4F6] p-6">
        <p>Loading doctor...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F3F4F6] p-4 sm:p-6">
        <div className="text-center max-w-md w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Doctor not found
          </h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            We couldn't locate the doctor.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded text-sm sm:text-base"
            >
              Go Back
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-[#FF8040] text-white rounded text-sm sm:text-base text-center"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const backLabel = source === "doctorData" ? "Doctors" : "Home";
  const imgSrc = getDoctorImageUrl(doctor.image);

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="bg-white rounded-xl shadow-md w-full max-w-5xl p-4 sm:p-6 md:p-10">
        {/* Back button */}
        <button
          onClick={() =>
            window.history.length > 2 ? navigate(-1) : navigate("/")
          }
          className="text-black text-xs sm:text-sm mb-4 hover:bg-[#FF8040]/10 px-2 py-1 rounded transition"
        >
          ← Back to {backLabel}
        </button>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          {imgSrc && (
            <div className="w-full">
              <img
                src={imgSrc}
                alt={doctor.name}
                className="w-full max-h-80 sm:max-h-[26rem] object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex flex-col justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {doctor.name}
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {doctor.location}
              </p>

              <div className="flex flex-wrap items-center mt-2 gap-2 sm:gap-3">
                <span className="bg-[#FF8040] text-white px-2 py-1 rounded-md text-xs sm:text-sm font-semibold">
                  ⭐ {doctor.rating}
                </span>
                <span className="text-gray-600 text-xs sm:text-sm">
                  {doctor.reviews} reviews
                </span>
              </div>

              <p className="mt-3 text-gray-700 text-sm sm:text-base">
                {doctor.degree}
              </p>
              <p className="mt-1 text-[#FF8040] font-medium text-sm sm:text-base">
                {doctor.specialization}
              </p>

              <p className="mt-2 text-gray-700 text-sm sm:text-base leading-relaxed">
                {doctor.bio}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 sm:gap-8">
                <div>
                  <h5 className="font-medium text-sm sm:text-base">
                    Experience
                  </h5>
                  <p className="text-sm text-gray-600">
                    {doctor.experience}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-sm sm:text-base">Fee</h5>
                  <p className="text-sm text-gray-600">₹ {doctor.fee}</p>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="font-medium text-sm sm:text-base">
                  Available Timings
                </h5>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  {doctor.timings?.map((t, i) => (
                    <li key={i}>• {t}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <h5 className="font-medium text-sm sm:text-base">Contact</h5>
                <p className="text-sm text-gray-600 mt-1">
                  Phone: {doctor.phone}
                </p>
                <p className="text-sm text-gray-600">Email: {doctor.email}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => setOpenBooking(true)}
                className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-[#FF8040] hover:bg-black text-white rounded-lg text-sm sm:text-base text-center"
              >
                Book Appointment
              </button>

              <Link
                to="/doctors"
                className="w-full sm:w-auto px-4 py-2 sm:py-3 border rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 text-center"
              >
                View All Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>

      {openBooking && (
        <BookingModal doctor={doctor} onClose={() => setOpenBooking(false)} />
      )}
    </div>
  );
};

export default DoctorDetail;

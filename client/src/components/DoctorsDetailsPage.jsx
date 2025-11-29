import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const getDoctorImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `http://localhost:5000${imagePath}`;
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

  // ✅ Get logged-in user from localStorage
  const rawUser = localStorage.getItem("user");
  const currentUser = rawUser ? JSON.parse(rawUser) : null;

  if (!currentUser) {
    setError("Please log in as a patient to book an appointment.");
    // optional: redirect to login and come back
    // window.location.href = `/login?next=/doctor/${doctor._id}`;
    return;
  }

  if (currentUser.role !== "patient") {
    setError("Only patient accounts can book appointments.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const res = await api.post("/appointments/create-checkout-session", {
      doctorId: doctor._id,
      date: form.date,
      time: form.time,
    });
    window.location.href = res.data.url;
  } catch (err) {
    console.error(err);
    setLoading(false);
    setError(
      err?.response?.data?.message || "Failed to start payment. Try again."
    );
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            Book Appointment — {doctor.name}
          </h3>
          <button onClick={onClose} className="text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Patient name"
              className="border rounded px-3 py-2"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#FF8040] text-white rounded hover:bg-black"
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
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F3F4F6] p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Doctor not found</h2>
          <p className="text-gray-600 mb-4">We couldn't locate the doctor.</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded"
            >
              Go Back
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-[#FF8040] text-white rounded"
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
    <div className="min-h-[80vh] bg-[#F3F4F6] py-10 px-6 flex justify-center">
      <div className="bg-white rounded-xl shadow-md max-w-[1100px] w-full p-6 md:p-10">
        <button
          onClick={() =>
            window.history.length > 2 ? navigate(-1) : navigate("/")
          }
          className="text-black text-sm mb-4 hover:bg-[#FF8040]/10 p-2 rounded transition"
        >
          ← Back to {backLabel}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imgSrc && (
            <img
              src={imgSrc}
              alt={doctor.name}
              className="w-full h-[70vh] object-cover rounded-lg"
            />
          )}

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {doctor.name}
              </h1>
              <p className="text-gray-600 mt-1">{doctor.location}</p>

              <div className="flex items-center mt-1 gap-3">
                <span className="bg-[#FF8040] text-white px-2 py-1 rounded-md text-sm font-semibold">
                  ⭐ {doctor.rating}
                </span>
                <span className="text-gray-600 text-sm">
                  {doctor.reviews} reviews
                </span>
              </div>

              <p className="mt-3 text-gray-700 text-sm">{doctor.degree}</p>
              <p className="mt-1 text-[#FF8040] font-medium">
                {doctor.specialization}
              </p>

              <p className="mt-1 text-gray-700 text-sm leading-relaxed">
                {doctor.bio}
              </p>

              <div className="mt-4 flex items-center gap-6">
                <div>
                  <h5 className="font-medium text-sm">Experience</h5>
                  <p className="text-sm text-gray-600">
                    {doctor.experience}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-sm">Fee</h5>
                  <p className="text-sm text-gray-600">₹ {doctor.fee}</p>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="font-medium text-sm">Available Timings</h5>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  {doctor.timings?.map((t, i) => (
                    <li key={i}>• {t}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-2">
                <h5 className="font-medium text-sm">Contact</h5>
                <p className="text-sm text-gray-600 mt-1">
                  Phone: {doctor.phone}
                </p>
                <p className="text-sm text-gray-600">Email: {doctor.email}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setOpenBooking(true)}
                className="px-4 bg-[#FF8040] hover:bg-black text-white rounded-lg"
              >
                Book Appointment
              </button>

              <Link
                to="/doctors"
                className="px-4 py-3 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const DoctorRegister = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    degree: "",
    specialization: "",
    bio: "",
    experience: "",
    fee: "",
    phone: "",
    timingsText: "", // multiline text, one timing per line
  });

  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const timingsArray = form.timingsText
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean);

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("location", form.location);
      fd.append("degree", form.degree);
      fd.append("specialization", form.specialization);
      fd.append("bio", form.bio);
      fd.append("experience", form.experience);
      fd.append("fee", form.fee);
      fd.append("phone", form.phone);
      fd.append("timings", JSON.stringify(timingsArray));
      if (imageFile) fd.append("image", imageFile);

      const res = await api.post("/auth/register-doctor", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // store tokens
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      // update auth context
      setUser(res.data.user);

      navigate("/doctor-dashboard"); // or wherever you want
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-xl shadow p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold mb-2">Doctor Registration</h1>
        <p className="text-sm text-gray-600 mb-4">
          Create your Connect2Cure doctor profile. These details will appear on
          your card and detail page.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded px-3 py-2"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (e.g. Delhi, India)"
            className="border rounded px-3 py-2"
          />
          <input
            name="degree"
            value={form.degree}
            onChange={handleChange}
            placeholder="Degree (e.g. BDS, MDS ...)"
            className="border rounded px-3 py-2"
          />
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            placeholder="Specialization (e.g. Dental Surgeon)"
            className="border rounded px-3 py-2"
          />
          <input
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Experience (e.g. 15+ years)"
            className="border rounded px-3 py-2"
          />
          <input
            name="fee"
            type="number"
            value={form.fee}
            onChange={handleChange}
            placeholder="Consultation fee (₹)"
            className="border rounded px-3 py-2"
          />
        </div>

        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Short bio / about you"
          className="border rounded px-3 py-2 w-full"
          rows={3}
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            Available Timings (one per line)
          </label>
          <textarea
            name="timingsText"
            value={form.timingsText}
            onChange={handleChange}
            placeholder={`Mon–Sat: 9:30 AM – 1:30 PM\nMon–Fri: 4:00 PM – 7:00 PM`}
            className="border rounded px-3 py-2 w-full"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Image
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#FF8040] text-white rounded hover:bg-black"
        >
          {loading ? "Creating account..." : "Create Doctor Account"}
        </button>
      </form>
    </div>
  );
};

export default DoctorRegister;

import React, { useState } from "react";

const DoctorOnboarding = () => {
  const [form, setForm] = useState({
    phone: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    clinicName: "",
    clinicAddress: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch("http://localhost:5000/api/onboarding/doctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience || 0),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "Error saving profile");
      return;
    }

    setMessage("Profile saved! Redirecting...");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Doctor details</h2>
      {message && <p className="mb-3 text-sm text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          placeholder="Specialization (e.g. Cardiologist)"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="licenseNumber"
          value={form.licenseNumber}
          onChange={handleChange}
          placeholder="License number"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="yearsOfExperience"
          value={form.yearsOfExperience}
          onChange={handleChange}
          placeholder="Years of experience"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="clinicName"
          value={form.clinicName}
          onChange={handleChange}
          placeholder="Clinic / Hospital name"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="clinicAddress"
          value={form.clinicAddress}
          onChange={handleChange}
          placeholder="Clinic address"
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="mt-2 w-full h-10 rounded bg-[#FF8040] text-white"
        >
          Save details
        </button>
      </form>
    </div>
  );
};

export default DoctorOnboarding;

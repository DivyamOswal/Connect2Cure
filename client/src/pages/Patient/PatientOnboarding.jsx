import React, { useState } from "react";

const PatientOnboarding = () => {
  const [form, setForm] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "other",
    bloodGroup: "",
    address: "",
    knownConditions: "",
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
    const API_BASE =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

    const res = await fetch(`${API_BASE}/onboarding/patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...form,
        knownConditions: form.knownConditions
          ? form.knownConditions.split(",").map((s) => s.trim())
          : [],
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
      <h2 className="text-xl font-semibold mb-4">Patient details</h2>
      {message && <p className="mb-3 text-sm text-[#FF8040]">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={handleChange}
          placeholder="Blood group (e.g. A+)"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="knownConditions"
          value={form.knownConditions}
          onChange={handleChange}
          placeholder="Known conditions (comma separated)"
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

export default PatientOnboarding;

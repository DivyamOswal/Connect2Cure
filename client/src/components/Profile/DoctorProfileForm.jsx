import { useState, useEffect } from "react";

export default function DoctorProfileForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    bio: "",
    specialization: "",
    experienceYears: "",
    clinicName: "",
    fees: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  return (
    <form
      className="space-y-4 bg-white p-6 rounded-xl shadow"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <h2 className="text-xl font-bold">Doctor Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["fullName", "phone", "specialization", "clinicName"].map((field) => (
          <div key={field}>
            <label className="text-sm font-medium capitalize">{field}</label>
            <input
              name={field}
              value={form[field] || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        ))}

        <div>
          <label className="text-sm font-medium">Experience (years)</label>
          <input
            name="experienceYears"
            type="number"
            value={form.experienceYears || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Consultation Fee</label>
          <input
            name="fees"
            type="number"
            value={form.fees || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Bio</label>
        <textarea
          name="bio"
          rows={3}
          value={form.bio}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

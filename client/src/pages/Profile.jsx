// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // form state
  const [basic, setBasic] = useState({
    name: "",
    email: "",
  });

  const [patientProfile, setPatientProfile] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "other",
    bloodGroup: "",
    address: "",
    knownConditions: "",
  });

  const [doctorProfile, setDoctorProfile] = useState({
    phone: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    clinicName: "",
    clinicAddress: "",
  });

  // fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          window.location.href = "/login";
          return;
        }

        const res = await fetch("http://localhost:5000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data.user);
        setRole(data.user.role);
        setBasic({
          name: data.user.name || "",
          email: data.user.email || "",
        });

        if (data.user.role === "patient" && data.profile) {
          setPatientProfile({
            phone: data.profile.phone || "",
            dateOfBirth: data.profile.dateOfBirth
              ? data.profile.dateOfBirth.substring(0, 10)
              : "",
            gender: data.profile.gender || "other",
            bloodGroup: data.profile.bloodGroup || "",
            address: data.profile.address || "",
            knownConditions: (data.profile.knownConditions || []).join(", "),
          });
        } else if (data.user.role === "doctor" && data.profile) {
          setDoctorProfile({
            phone: data.profile.phone || "",
            specialization: data.profile.specialization || "",
            licenseNumber: data.profile.licenseNumber || "",
            yearsOfExperience:
              data.profile.yearsOfExperience?.toString() || "",
            clinicName: data.profile.clinicName || "",
            clinicAddress: data.profile.clinicAddress || "",
          });
        }
      } catch (err) {
        console.error("PROFILE LOAD ERROR:", err);
        setError(err.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasic((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setDoctorProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        window.location.href = "/login";
        return;
      }

      let profilePayload = {};

      if (role === "patient") {
        profilePayload = {
          phone: patientProfile.phone,
          dateOfBirth: patientProfile.dateOfBirth || null,
          gender: patientProfile.gender,
          bloodGroup: patientProfile.bloodGroup,
          address: patientProfile.address,
          knownConditions: patientProfile.knownConditions
            ? patientProfile.knownConditions.split(",").map((s) => s.trim())
            : [],
        };
      } else if (role === "doctor") {
        profilePayload = {
          phone: doctorProfile.phone,
          specialization: doctorProfile.specialization,
          licenseNumber: doctorProfile.licenseNumber,
          yearsOfExperience: Number(doctorProfile.yearsOfExperience || 0),
          clinicName: doctorProfile.clinicName,
          clinicAddress: doctorProfile.clinicAddress,
        };
      }

      const res = await fetch("http://localhost:5000/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: basic.name,
          email: basic.email,
          profile: profilePayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setMessage("Profile updated successfully");
      setUser((prev) => ({ ...prev, ...data.user }));
    } catch (err) {
      console.error("PROFILE SAVE ERROR:", err);
      setError(err.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500">Unable to load profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-2">My Profile</h2>
      <p className="text-gray-500 mb-6">
        Role:{" "}
        <span className="font-medium capitalize">
          {role === "doctor" ? "Doctor" : "Patient"}
        </span>
      </p>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-5 rounded-xl shadow">
        {/* Basic info */}
        <div>
          <h3 className="text-lg font-medium mb-3">Basic information</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Name
              </label>
              <input
                name="name"
                value={basic.name}
                onChange={handleBasicChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={basic.email}
                onChange={handleBasicChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Your email"
              />
            </div>
          </div>
        </div>

        {/* Role-specific section */}
        {role === "patient" && (
          <div>
            <h3 className="text-lg font-medium mb-3">Patient details</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={patientProfile.phone}
                  onChange={handlePatientChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Date of birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={patientProfile.dateOfBirth}
                  onChange={handlePatientChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={patientProfile.gender}
                  onChange={handlePatientChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Blood group
                </label>
                <input
                  name="bloodGroup"
                  value={patientProfile.bloodGroup}
                  onChange={handlePatientChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. A+"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Address
                </label>
                <input
                  name="address"
                  value={patientProfile.address}
                  onChange={handlePatientChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Known conditions (comma separated)
                </label>
                <textarea
                  name="knownConditions"
                  value={patientProfile.knownConditions}
                  onChange={handlePatientChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Diabetes, Hypertension, ..."
                />
              </div>
            </div>
          </div>
        )}

        {role === "doctor" && (
          <div>
            <h3 className="text-lg font-medium mb-3">Doctor details</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={doctorProfile.phone}
                  onChange={handleDoctorChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Specialization
                </label>
                <input
                  name="specialization"
                  value={doctorProfile.specialization}
                  onChange={handleDoctorChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Cardiologist, Dermatologist, ..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  License number
                </label>
                <input
                  name="licenseNumber"
                  value={doctorProfile.licenseNumber}
                  onChange={handleDoctorChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Years of experience
                </label>
                <input
                  name="yearsOfExperience"
                  value={doctorProfile.yearsOfExperience}
                  onChange={handleDoctorChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  type="number"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Clinic / Hospital name
                </label>
                <input
                  name="clinicName"
                  value={doctorProfile.clinicName}
                  onChange={handleDoctorChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Clinic address
                </label>
                <input
                  name="clinicAddress"
                  value={doctorProfile.clinicAddress}
                  onChange={handleDoctorChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-full bg-[#FF8040] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

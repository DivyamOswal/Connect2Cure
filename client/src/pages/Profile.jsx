import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation("profile");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // basic info
  const [basic, setBasic] = useState({
    name: "",
    email: "",
  });

  // patient profile
  const [patientProfile, setPatientProfile] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "other",
    bloodGroup: "",
    address: "",
    knownConditions: "",
  });

  // doctor profile
  const [doctorProfile, setDoctorProfile] = useState({
    phone: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    clinicName: "",
    clinicAddress: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const API_BASE =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

        const res = await fetch(`${API_BASE}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

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
        }

        if (data.user.role === "doctor" && data.profile) {
          setDoctorProfile({
            phone: data.profile.phone || "",
            specialization: data.profile.specialization || "",
            licenseNumber: data.profile.licenseNumber || "",
            yearsOfExperience: data.profile.yearsOfExperience?.toString() || "",
            clinicName: data.profile.clinicName || "",
            clinicAddress: data.profile.clinicAddress || "",
          });
        }
      } catch (err) {
        setError(t("errors.load"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  const handleBasicChange = (e) =>
    setBasic({ ...basic, [e.target.name]: e.target.value });

  const handlePatientChange = (e) =>
    setPatientProfile({ ...patientProfile, [e.target.name]: e.target.value });

  const handleDoctorChange = (e) =>
    setDoctorProfile({ ...doctorProfile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
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
      }

      if (role === "doctor") {
        profilePayload = {
          phone: doctorProfile.phone,
          specialization: doctorProfile.specialization,
          licenseNumber: doctorProfile.licenseNumber,
          yearsOfExperience: Number(doctorProfile.yearsOfExperience || 0),
          clinicName: doctorProfile.clinicName,
          clinicAddress: doctorProfile.clinicAddress,
        };
      }

      const API_BASE =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

      const res = await fetch(`${API_BASE}/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: basic.name,
          email: basic.email,
          profile: profilePayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage(t("success"));
      setUser((prev) => ({ ...prev, ...data.user }));
    } catch (err) {
      setError(t("errors.save"));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500">{t("loadError")}</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-2">{t("title")}</h2>
      <p className="text-gray-500 mb-6">
        {t("roleLabel")}:{" "}
        <span className="font-medium capitalize">
          {t(`roles.${role}`)}
        </span>
      </p>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 border rounded-lg px-3 py-2">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-5 rounded-xl shadow"
      >
        {/* BASIC INFO */}
        <div>
          <h3 className="text-lg font-medium mb-3">{t("basicInfo")}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              name="name"
              value={basic.name}
              onChange={handleBasicChange}
              placeholder={t("placeholders.name")}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              name="email"
              value={basic.email}
              onChange={handleBasicChange}
              placeholder={t("placeholders.email")}
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* PATIENT */}
        {role === "patient" && (
          <div>
            <h3 className="text-lg font-medium mb-3">
              {t("patientDetails")}
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                name="phone"
                value={patientProfile.phone}
                onChange={handlePatientChange}
                placeholder={t("labels.phone")}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <input
                type="date"
                name="dateOfBirth"
                value={patientProfile.dateOfBirth}
                onChange={handlePatientChange}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <select
                name="gender"
                value={patientProfile.gender}
                onChange={handlePatientChange}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="male">{t("genderOptions.male")}</option>
                <option value="female">{t("genderOptions.female")}</option>
                <option value="other">{t("genderOptions.other")}</option>
              </select>

              <input
                name="bloodGroup"
                value={patientProfile.bloodGroup}
                onChange={handlePatientChange}
                placeholder={t("placeholders.bloodGroup")}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="address"
                value={patientProfile.address}
                onChange={handlePatientChange}
                placeholder={t("labels.address")}
                className="border rounded-lg px-3 py-2 text-sm md:col-span-2"
              />

              <textarea
                name="knownConditions"
                value={patientProfile.knownConditions}
                onChange={handlePatientChange}
                placeholder={t("placeholders.conditions")}
                rows={2}
                className="border rounded-lg px-3 py-2 text-sm md:col-span-2"
              />
            </div>
          </div>
        )}

        {/* DOCTOR */}
        {role === "doctor" && (
          <div>
            <h3 className="text-lg font-medium mb-3">
              {t("doctorDetails")}
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                name="phone"
                value={doctorProfile.phone}
                onChange={handleDoctorChange}
                placeholder={t("labels.phone")}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="specialization"
                value={doctorProfile.specialization}
                onChange={handleDoctorChange}
                placeholder={t("labels.specialization")}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="licenseNumber"
                value={doctorProfile.licenseNumber}
                onChange={handleDoctorChange}
                placeholder={t("labels.license")}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <input
                type="number"
                name="yearsOfExperience"
                value={doctorProfile.yearsOfExperience}
                onChange={handleDoctorChange}
                placeholder={t("labels.experience")}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="clinicName"
                value={doctorProfile.clinicName}
                onChange={handleDoctorChange}
                placeholder={t("labels.clinicName")}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <input
                name="clinicAddress"
                value={doctorProfile.clinicAddress}
                onChange={handleDoctorChange}
                placeholder={t("labels.clinicAddress")}
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-full bg-[#FF8040] text-white text-sm font-medium disabled:opacity-60"
          >
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

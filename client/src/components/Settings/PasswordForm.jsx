import { useState } from "react";
import api from "../../api/axios";

export default function PasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const change = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await api.post("/auth/change-password", form);
      setMsg("Password updated");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMsg("Error updating password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="border rounded p-4 space-y-3">
      <h2 className="font-semibold">Change Password</h2>
      <div className="flex flex-col gap-1">
        <label className="text-sm">Current Password</label>
        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={change}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm">New Password</label>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={change}
          className="border rounded px-2 py-1"
        />
      </div>

      <button
        disabled={saving}
        className="px-3 py-1 rounded bg-[#FF8040] text-white text-sm"
      >
        {saving ? "Updating..." : "Update Password"}
      </button>

      {msg && <p className="text-xs text-gray-500 mt-1">{msg}</p>}
    </form>
  );
}

import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AccountForm() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || "", email: user.email || "" });
  }, [user]);

  const change = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const res = await api.put("/auth/me", {
        name: form.name,
        email:form.email
      });
      setUser(res.data);
      setMsg("Saved");
    } catch (err) {
      setMsg("Error saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="border rounded p-4 space-y-3">
      <h2 className="font-semibold">Account</h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={change}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={change}
          className="border rounded px-2 py-1 bg-gray-100"
          disabled
        />
      </div>

      <button
        disabled={saving}
        className="px-3 py-1 rounded bg-[#FF8040] text-white text-sm"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      {msg && <p className="text-xs text-gray-500 mt-1">{msg}</p>}
    </form>
  );
}

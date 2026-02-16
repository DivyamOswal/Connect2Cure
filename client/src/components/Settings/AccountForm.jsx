import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AccountForm() {
  const { t } = useTranslation("account");
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
    });
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
        email: form.email,
      });

      setUser(res.data);
      setMsg(t("messages.saved"));
    } catch (err) {
      setMsg(t("messages.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="border rounded p-4 space-y-3 bg-white">
      <h2 className="font-semibold">{t("title")}</h2>

      {/* NAME */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">{t("fields.name")}</label>
        <input
          name="name"
          value={form.name}
          onChange={change}
          className="border rounded px-2 py-1"
          placeholder={t("placeholders.name")}
        />
      </div>

      {/* EMAIL */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">{t("fields.email")}</label>
        <input
          name="email"
          value={form.email}
          className="border rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
          disabled
        />
      </div>

      {/* SAVE BUTTON */}
      <button
        disabled={saving}
        className="px-3 py-1 rounded bg-[#FF8040] text-white text-sm disabled:opacity-60"
      >
        {saving ? t("saving") : t("save")}
      </button>

      {/* MESSAGE */}
      {msg && <p className="text-xs text-gray-500 mt-1">{msg}</p>}
    </form>
  );
}

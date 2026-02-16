import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";

export default function PasswordForm() {
  const { t } = useTranslation("password");

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
      setMsg(t("messages.success"));
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMsg(t("messages.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="border rounded p-4 space-y-3 bg-white">
      <h2 className="font-semibold">{t("title")}</h2>

      {/* CURRENT PASSWORD */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">{t("fields.currentPassword")}</label>
        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={change}
          className="border rounded px-2 py-1"
          placeholder={t("placeholders.currentPassword")}
        />
      </div>

      {/* NEW PASSWORD */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">{t("fields.newPassword")}</label>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={change}
          className="border rounded px-2 py-1"
          placeholder={t("placeholders.newPassword")}
        />
      </div>

      {/* SUBMIT */}
      <button
        disabled={saving}
        className="px-3 py-1 rounded bg-[#FF8040] text-white text-sm disabled:opacity-60"
      >
        {saving ? t("updating") : t("update")}
      </button>

      {msg && <p className="text-xs text-gray-500 mt-1">{msg}</p>}
    </form>
  );
}

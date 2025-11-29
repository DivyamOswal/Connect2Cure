import AccountForm from "../components/settings/AccountForm";
import PasswordForm from "../components/settings/PasswordForm";
import { useAuth } from "../context/AuthContext";   

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) return <div className="p-4">Please log in</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-sm text-gray-600 mb-4">
        Manage your account details and password.
      </p>

      <AccountForm />
      <PasswordForm />
    </div>
  );
}

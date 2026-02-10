import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

const getUserFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Guest links
  const guestLinks = [
    { name: t("home"), path: "/" },
    { name: t("findDoctors"), path: "/doctors" },
    { name: t("features"), path: "/features" },
    { name: t("about"), path: "/about" },
    { name: t("contact"), path: "/contact" }
  ];

  // Patient links
  const patientLinks = [
    { name: t("dashboard"), path: "/patient/dashboard" },
    { name: t("myDoctors"), path: "/patient/doctors" },
    { name: t("allDoctors"), path: "/doctors" },
    { name: t("appointments"), path: "dashboard/patient/appointments" },
    { name: t("chat"), path: "/chat" },
    { name: t("videoCall"), path: "/videoCall" },
    { name: t("aiSummary"), path: "/patient/summary" },
    { name: t("billing"), path: "/patient/billing" },
    { name: t("plans"), path: "/patient/plans" }
  ];

  // Doctor links
  const doctorLinks = [
    { name: t("dashboard"), path: "dashboard/doctor" },
    { name: t("myPatients"), path: "/dashboard/doctor/patients" },
    { name: t("appointments"), path: "/dashboard/doctor/appointments" },
    { name: t("chat"), path: "/chat" },
    { name: t("videoCall"), path: "/videoCall" },
    { name: t("earnings"), path: "dashboard/doctor/earnings" }
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(getUserFromStorage());

  const firstMenuLinkRef = useRef(null);
  const profileButtonRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    navigate("/login");
  };

  const navLinks = user
    ? user.role === "doctor"
      ? doctorLinks
      : patientLinks
    : guestLinks;

  const firstName = (name) => (name ? name.split(" ")[0] : "User");

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/30 backdrop-blur-md text-gray-800 shadow-sm py-2"
          : "bg-[#FF8040] py-3 sm:py-4"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <h1 className={`text-xl sm:text-2xl font-bold ${isScrolled ? "text-black" : "text-white"}`}>
          Connect2Cure
        </h1>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={isScrolled ? "text-gray-700" : "text-white"}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="hidden lg:flex items-center gap-4">
        {/* 🌐 Language selector */}
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="rounded px-2 py-1 text-sm"
        >
          <option value="en">EN</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>

        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {t("loginSignup")}
          </button>
        )}

        {user && (
          <div className="relative">
            <button
              ref={profileButtonRef}
              onClick={() => setIsProfileOpen((s) => !s)}
              className="flex items-center gap-2"
            >
              <User className="w-6 h-6 text-white" />
              <span className={isScrolled ? "text-gray-700" : "text-white"}>
                {firstName(user.name)}
              </span>
            </button>

            {isProfileOpen && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 mt-2 bg-white rounded shadow"
              >
                <Link className="block px-4 py-2" to="/profile">{t("profile")}</Link>
                <Link className="block px-4 py-2" to="/settings">{t("settings")}</Link>
                <button onClick={logout} className="block px-4 py-2 text-red-600">
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              ref={i === 0 ? firstMenuLinkRef : undefined}
            >
              {link.name}
            </Link>
          ))}

          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="border px-3 py-2"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>

          {!user && (
            <button onClick={() => navigate("/login")}>
              {t("loginSignup")}
            </button>
          )}

          {user && (
            <button onClick={logout} className="text-red-600">
              {t("logout")}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

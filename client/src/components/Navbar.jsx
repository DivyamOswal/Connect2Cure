import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

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
  // Generic guest links (you had hotels/villas etc. — replaced with app-appropriate links)
  const guestLinks = [
    { name: "Home", path: "/" },
    { name: "Find Doctors", path: "/doctors" },
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Links mapped by role
  const patientLinks = [
    { name: "Dashboard", path: "/patient/dashboard" },
    { name: "My Doctors", path: "/patient/doctors" },
    {name:"My Appointments", path:"dashboard/patient/appointments"},
    { name: "Chat", path: "/chat" },
    { name: "VideoCall", path: "/videoCall" },
    { name: "AI Summary", path: "/patient/summary" },
    { name: "Billing", path: "/patient/billing" },
  ];

  const doctorLinks = [
    { name: "Dashboard", path: "dashboard/doctor" },
    { name: "My Patients", path: "/dashboard/doctor/patients" },
    { name: "Appointments", path: "/dashboard/doctor/appointments" },
    { name: "Chat", path: "/chat" },
    { name: "Video Call", path: "/videoCall" },
    { name: "Earnings", path: "dashboard/doctor/earnings" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(getUserFromStorage());
  const navigate = useNavigate();

  const firstMenuLinkRef = useRef(null);
  const profileButtonRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // lock body scroll when menu is open + focus management + Esc to close
  useEffect(() => {
    const body = document.body;
    if (isMenuOpen) {
      body.style.overflow = "hidden";
      setTimeout(() => firstMenuLinkRef.current?.focus(), 50);
    } else {
      body.style.overflow = "";
    }

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // close profile dropdown when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const logout = () => {
    // replace with your logout routine (clear tokens, call API, etc.)
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    navigate("/login");
  };

  // Determine links to render
  const navLinks = user
    ? user.role === "doctor"
      ? doctorLinks
      : patientLinks
    : guestLinks;

  // small helper to get first name
  const firstName = (name) => (name ? name.split(" ")[0] : "User");

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/30 backdrop-blur-md text-gray-800 shadow-sm py-2"
          : "bg-[#FF8040] py-3 sm:py-4"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link to={"/"} aria-label="Go to homepage">
        <h1
          className={`text-xl sm:text-2xl font-extrabold tracking-wide font-sans ${
            isScrolled ? "text-black" : "text-white"
          }`}
        >
          Connect2Cure
        </h1>
      </Link>

      {/* Desktop Nav (only from lg and above) */}
      <div
        className="hidden lg:flex items-center gap-8 font-medium text-base"
        role="menubar"
        aria-hidden={isMenuOpen}
      >
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`transition-colors duration-300  ${
              isScrolled
                ? "text-gray-700 hover:text-black"
                : "text-white hover:text-black"
            }`}
            role="menuitem"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right Side (Desktop) */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Notifications / Chat quick icons (common for logged-in users) */}
        {user && (
          <>
            <button
              aria-label="Notifications"
              className={`p-2 rounded-md transition ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() =>
                navigate(
                  user.role === "doctor"
                    ? "/notifications"
                    : "/patient/notifications"
                )
              }
              title="Notifications"
            >
              {/* bell icon */}
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18.6 14.2V11a6 6 0 1 0-12 0v3.2c0 .538-.214 1.055-.595 1.395L4 17h11z" />
              </svg>
            </button>

           <Link to="/chat">
            <button
              aria-label="Open chat"
              className={`p-2 rounded-md transition ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              title="Chat"
            >
              {/* chat icon */}
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
           </Link>
          </>
        )}

        {/* Login/Signup for guests */}
        {!user && (
          <>
            <button
              className={`px-4 py-2 rounded-md font-semibold text-sm transition-all hover:cursor-pointer ${
                isScrolled
                  ? "bg-[#FF8040] text-white hover:bg-black"
                  : "bg-gray-800 text-white hover:bg-black"
              }`}
              onClick={() => navigate("/login")}
              aria-label="Login or Signup"
            >
              Login / Signup
            </button>
          </>
        )}

        {/* Profile / Avatar */}
        {user && (
          <div className="relative">
            <button
              ref={profileButtonRef}
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setIsProfileOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
              aria-label="Open profile menu"
              title="Account"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
              <span
                className={`hidden sm:inline ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {firstName(user.name)}
              </span>
              <svg
                className={`h-4 w-4 transition-transform ${
                  isProfileOpen ? "rotate-180" : "rotate-0"
                } ${isScrolled ? "text-gray-700" : "text-white"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile dropdown */}
            {isProfileOpen && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50"
                role="menu"
                aria-label="Profile menu"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
                {user.role === "doctor" ? (
                  <Link
                    to="dashboard/doctor"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/patient/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile + Tablet Menu Button (up to md/lg) */}
      <div className="flex items-center lg:hidden">
        <button
          onClick={() => {
            setIsMenuOpen((s) => !s);
            setIsProfileOpen(false);
          }}
          className="inline-flex items-center justify-center"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className={`h-7 w-7 cursor-pointer ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile/Tablet Menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 left-0 w-full h-screen bg-white text-lg flex flex-col lg:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-transform duration-500 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Links */}
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="hover:text-[#FF8040] text-base sm:text-lg"
            onClick={() => setIsMenuOpen(false)}
            ref={i === 0 ? firstMenuLinkRef : undefined}
          >
            {link.name}
          </Link>
        ))}

        {/* Mobile/Tablet Login Button (when guest) */}
        {!user && (
          <button
            className="bg-[#FF8040] text-white rounded-md mt-4 px-4 py-2 text-sm sm:text-base"
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/login");
            }}
          >
            Login / Signup
          </button>
        )}

        {/* If logged in, quick actions */}
        {user && (
          <>
            <div className="flex gap-3 mt-4">
              <button
                className="px-3 py-2 rounded-md bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(
                    user.role === "doctor" ? "/doctor/chat" : "/patient/chat"
                  );
                }}
              >
                Open Chat
              </button>
              <button
                className="px-3 py-2 rounded-md bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(
                    user.role === "doctor"
                      ? "/doctor/ai-tools"
                      : "/patient/summary"
                  );
                }}
              >
                AI Summary
              </button>
            </div>

            <div className="mt-6">
              <button
                className="block w-full text-left px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/profile");
                }}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-6 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

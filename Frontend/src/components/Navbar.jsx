import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import { useAuthStore } from "../store/useAdminstore";
import { useCustomerAuthStore } from "../store/useCustomerAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import rentmateLogo from "../images/RentMate-Logo.webp";

const Navbar = ({ onMenuClick, open }) => {
  const admin = useAuthStore((state) => state.authAdmin);
  const adminLogout = useAuthStore((state) => state.logout);

  const customer = useCustomerAuthStore((state) => state.customer);
  const customerLogout = useCustomerAuthStore((state) => state.logoutCustomer);

  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Do you really want to log out?");
    if (!confirmLogout) return;

    // Call both logouts if both are logged in, or just the one that is logged in
    if (admin) {
      await adminLogout();
    }
    if (customer) {
      await customerLogout();
    }

    // Redirect based on who was logged in
    if (admin && customer) {
      navigate("/"); // Both logged out, go to home
    } else if (admin) {
      navigate("/adminlogin");
    } else if (customer) {
      navigate("/customerlogin");
    } else {
      navigate("/");
    }
  };

  // Toast handlers for bell, settings
  const handleBellClick = () => {
    toast("Notifications functionality coming soon!");
  };
  const handleProfileClick = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    navigate("/profile");
  };
  const handleSettingsClick = (e) => {
    e.preventDefault();
    toast("Settings functionality coming soon!");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-40
        bg-[#181c2f]/90 border-b border-blue-900/40
        shadow-[0_2px_16px_0_rgba(16,16,32,0.18)]
        px-6 py-2 h-20 flex justify-between items-center
        transition-all duration-300
        ${open ? "ml-0" : "ml-0"}
      `}
    >
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {open && (
          <FaBars
            className="text-blue-400 hover:text-fuchsia-400 cursor-pointer text-2xl transition-all duration-200"
            onClick={onMenuClick}
          />
        )}
        <span className="flex items-center gap-3">
          <img
            src={rentmateLogo}
            alt="RentMate Logo"
            className="w-12 h-12 object-contain rounded-lg shadow border border-blue-900/30 bg-[#232946]/80"
          />
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 drop-shadow-lg text-3xl tracking-wide select-none">
            RentMate
          </span>
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-x-4">
        {/* Search */}
        <div className="relative md:w-64 hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#232946]/80 text-white placeholder-blue-300 shadow border border-blue-900/30 focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 transition-all duration-300"
          />
        </div>

        {/* Notification Icon */}
        <button
          type="button"
          className="relative text-blue-300 hover:text-fuchsia-400 transition-all duration-200 p-2 rounded-full hover:bg-[#232946]/60 focus:outline-none"
          onClick={handleBellClick}
          title="Notifications"
        >
          <FaBell className="w-6 h-6" />
          <span className="absolute top-1 right-1 block w-2 h-2 bg-pink-500 rounded-full ring-2 ring-[#181c2f]"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#232946]/70 hover:bg-[#232946]/90 focus:outline-none border border-blue-900/30 shadow-sm transition-all duration-200"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <FaUserCircle className="w-8 h-8 text-fuchsia-400 hover:text-blue-400 transition-all duration-200" />
            <span className="hidden md:inline font-semibold text-blue-100">
              {admin?.name
                ? admin.name
                : customer?.fullname
                ? customer.fullname
                : "User"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#232946]/95 rounded-xl shadow-2xl border border-blue-900/40 z-50 animate-fade-in-up">
              <ul className="py-2 text-sm text-blue-100">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-blue-900/40 rounded transition-all duration-200"
                    onClick={handleProfileClick}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-blue-900/40 rounded transition-all duration-200"
                    onClick={handleSettingsClick}
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-pink-600/40 text-pink-400 rounded transition-all duration-200"
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Animation for dropdown */}
      <style>
        {`
        .animate-fade-in-up {
          animation: fadeInUp 0.25s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(16px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </nav>
  );
};
export default Navbar;

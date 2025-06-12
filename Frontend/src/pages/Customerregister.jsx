import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCustomerAuthStore } from "../store/useCustomerAuthStore.js";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiCalendar,
  FiCreditCard,
} from "react-icons/fi";

const CustomerSignup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phoneNo: "",
    DOB: "",
    licenseNo: "",
  });

  const [emailExists, setEmailExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const signupCustomer = useCustomerAuthStore((state) => state.signupCustomer);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (emailExists) setEmailExists(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, email, password, phoneNo, DOB, licenseNo } = formData;

    // Client-side validations
    if (!fullname || !email || !password || !phoneNo || !DOB || !licenseNo) {
      toast.error("❗ All fields are required!");
      return;
    }

    if (!/^[A-Za-z]+$/.test(formData.fullname)) {
      toast.error("Full name should contain only alphabets!");
      return;
    }

    if (password.length < 6) {
      toast.error("🔐 Password must be at least 6 characters!");
      return;
    }
   

    setIsLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      const customer = await signupCustomer(formData);
      if (customer) {
        toast.success("🎉 Account created! Please verify your email.", {
          id: toastId,
        });
        navigate("/verify?type=customer"); // Redirect to email verification page
      } else {
        setEmailExists(true);
        toast.error("❌ Email already in use. Try logging in.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("🚨 Something went wrong. Please try again later.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Icon mapping for each field
  const fieldIcons = {
    fullname: <FiUser className="h-5 w-5 text-gray-500" />,
    email: <FiMail className="h-5 w-5 text-gray-500" />,
    password: <FiLock className="h-5 w-5 text-gray-500" />,
    phoneNo: <FiPhone className="h-5 w-5 text-gray-500" />,
    DOB: <FiCalendar className="h-5 w-5 text-gray-500" />,
    licenseNo: <FiCreditCard className="h-5 w-5 text-gray-500" />,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-500 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGwlPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiI+PHBhdGggZD0iTTM2IDM0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNC00LTQtMS44LTQtNHoiLz48L2c+PC9nPg==')]"></div>
      </div>

      {/* Back to Dashboard button */}
      <motion.button
        type="button"
        className="fixed top-6 left-6 px-6 py-2 rounded-full bg-gray-800 text-white font-medium shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700 z-50 flex items-center gap-2"
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft className="w-5 h-5" />
        Dashboard
      </motion.button>

      {/* Main card */}
      <motion.div
        className="backdrop-blur-lg bg-gray-800/90 shadow-xl rounded-xl p-8 w-full max-w-lg border border-gray-700 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-green-500/20 to-lime-500/20 opacity-30 blur-sm"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Logo/Header */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-lime-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiUser className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Customer Signup</h2>
            <p className="text-gray-400 mt-1">
              Create your account to get started
            </p>
          </motion.div>

          {/* Signup Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={containerVariants}
          >
            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {fieldIcons.fullname}
                </div>
                <input
                  name="fullname"
                  type="text"
                  placeholder="Full Name"
                  className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  onChange={handleChange}
                  value={formData.fullname}
                  required
                  autoComplete="name"
                />
              </div>
            </motion.div>
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {fieldIcons.email}
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  onChange={handleChange}
                  value={formData.email}
                  required
                  autoComplete="email"
                />
              </div>
            </motion.div>
            {/* Password */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {fieldIcons.password}
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  onChange={handleChange}
                  value={formData.password}
                  required
                  autoComplete="new-password"
                />
              </div>
            </motion.div>
            {/* Phone Number */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="phoneNo"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {fieldIcons.phoneNo}
                </div>
                <input
                  name="phoneNo"
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  onChange={handleChange}
                  value={formData.phoneNo}
                  required
                  autoComplete="tel"
                />
              </div>
            </motion.div>
            {/* Date of Birth */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="DOB"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {fieldIcons.DOB}
                </div>
                <input
                  name="DOB"
                  type="date"
                  placeholder="Date of Birth"
                  className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  onChange={handleChange}
                  value={formData.DOB}
                  required
                  autoComplete="bday"
                />
              </div>
            </motion.div>
            {/* License Number */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="licenseNo"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Driving License Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {fieldIcons.licenseNo}
                </div>
                <input
                  name="licenseNo"
                  type="text"
                  placeholder="Driving License Number"
                  className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  onChange={handleChange}
                  value={formData.licenseNo}
                  required
                  autoComplete="off"
                />
              </div>
            </motion.div>
            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                className="btn w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-500 hover:to-lime-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin mr-2 w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Signing Up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-lime-500/30 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Email exists error and go to login */}
          {emailExists && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-red-400 font-semibold block mb-2">
                Email already exists.
              </span>
              <motion.button
                className="btn bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-600 text-white transition-all duration-300"
                onClick={() => navigate("/customerlogin")}
                whileHover={{ scale: 1.05 }}
              >
                Go to Login
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CustomerSignup;

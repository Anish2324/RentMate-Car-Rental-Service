import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAdminstore";
import { useCustomerAuthStore } from "../store/useCustomerAuthStore";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const EmailVerificationForm = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user type from query param (?type=admin or ?type=customer)
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get("type"); // 'admin' or 'customer'

  const { verify: adminVerify, isSubmitting: isAdminSubmitting } =
    useAuthStore();
  const {
    verifyCustomerEmail: customerVerify,
    isSubmitting: isCustomerSubmitting,
  } = useCustomerAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      setError("Code must be 6 digits");
      return;
    }
    setError("");
    let success = false;
    if (userType === "admin") {
      success = await adminVerify({ code });
      if (success) {
        setSuccess(true);
        setTimeout(() => navigate("/addcar"), 1500);
      }
    } else if (userType === "customer") {
      success = await customerVerify({ code });
      if (success) {
        setSuccess(true);
        setTimeout(() => navigate("/viewcars"), 1500);
      }
    } else {
      setError("Invalid verification type.");
    }
  };

  const isSubmitting =
    userType === "admin"
      ? isAdminSubmitting
      : userType === "customer"
      ? isCustomerSubmitting
      : false;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-2">
      <button
        type="button"
        className="fixed top-6 left-6 px-6 py-2 rounded-full bg-gray-800 text-white font-medium shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700 z-50 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft className="w-5 h-5" />
        Back
      </button>
      <div className="relative w-full max-w-md bg-[#232946] rounded-2xl shadow-2xl p-8 border border-blue-900">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-pink-500/20 opacity-30 blur-sm pointer-events-none"></div>
        <div className="relative flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <FiMail className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 mb-2">
            {userType === "admin"
              ? "Admin Email Verification"
              : userType === "customer"
              ? "Customer Email Verification"
              : "Email Verification"}
          </h2>
          <p className="text-sm text-blue-200 mb-6 text-center">
            We’ve sent a 6-digit code to your email. Enter it below to verify
            your account.
          </p>
          {success ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FiCheckCircle className="text-green-400 text-5xl mb-2 animate-bounce" />
              <div className="text-lg font-bold text-green-300 mb-1">
                Email Verified!
              </div>
              <div className="text-blue-100">Redirecting...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-blue-100 mb-1"
                >
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2 border border-blue-900 rounded-lg text-center tracking-wider font-mono bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-pink-600 hover:to-blue-600 transition disabled:opacity-50"
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationForm;

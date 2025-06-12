import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAdminstore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiLock, FiMail, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [securityCheck, setSecurityCheck] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const authAdmin = useAuthStore((state) => state.authAdmin);
  const isverified = useAuthStore((state) => state.isverified);

  // Security check on component mount
  useEffect(() => {
    const timer = setTimeout(() => setSecurityCheck(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if authenticated
  useEffect(() => {
    if (authAdmin && isverified) {
      navigate('/addcar');
    }
  }, [authAdmin, isverified, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { email, password } = formData;

    // Client-side validation
    if (!email || !password) {
      toast.error('All fields are required!');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 8 characters!');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      await login({ email, password });
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/admin/forgot-password');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Security overlay */}
      <AnimatePresence>
        {!securityCheck && (
          <motion.div 
            className="absolute inset-0 bg-gray-900 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center p-8 max-w-md">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-16 h-16 mb-6"
              >
                <FiLock className="w-full h-full text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Security Check</h3>
              <p className="text-gray-400">Verifying system security...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      {/* Back navigation */}
      <motion.button
        type="button"
        className="fixed top-6 left-6 px-6 py-2 rounded-full bg-gray-800 text-white font-medium shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700 z-50 flex items-center gap-2"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft className="w-5 h-5" />
        Dashboard
      </motion.button>

      {/* Main card */}
      <motion.div 
        className="backdrop-blur-lg bg-gray-800/90 shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-700 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: securityCheck ? 0 : 1.5 }}
      >
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-30 blur-sm"></div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={securityCheck ? "visible" : "hidden"}
          className="relative"
        >
          {/* Logo/Header */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiLock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
            <p className="text-gray-400 mt-1">Secure access to management tools</p>
          </motion.div>
          
          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-5" variants={containerVariants}>
            {/* Email field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />
              </div>
            </motion.div>
            
            {/* Password field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                  )}
                </button>
              </div>
            </motion.div>
            
            {/* Submit button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                className="btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading || isLoggingIn}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading || isLoggingIn ? (
                    <>
                      <FiLoader className="animate-spin mr-2 w-5 h-5" />
                      Authenticating...
                    </>
                  ) : (
                    'Login'
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Footer links */}
          <motion.div className="mt-6 text-center space-y-3" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                onClick={handleForgotPassword}
              >
                Forgot your password?
              </button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Need admin access?</p>
              <button
                type="button"
                className="btn btn-ghost text-purple-400 hover:text-purple-300 border border-gray-700 hover:border-gray-600 w-full py-2 text-sm font-medium transition-all duration-200"
                onClick={() => navigate('/Adminregister')}
              >
                Request Admin Account
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Security badge */}
      <motion.div 
        className="fixed bottom-4 right-4 bg-gray-800/80 backdrop-blur-sm text-xs text-gray-400 px-3 py-2 rounded-full border border-gray-700 flex items-center gap-2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>Secure Connection</span>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
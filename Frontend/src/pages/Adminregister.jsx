import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAdminstore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiLock, FiMail, FiEye, FiEyeOff, FiLoader, FiUser, FiPhone } from 'react-icons/fi'; // Added FiUser, FiPhone

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNo: '',
    });
    const [showPassword, setShowPassword] = useState(false); // Added for password visibility toggle
    const [securityCheck, setSecurityCheck] = useState(false);

    const navigate = useNavigate();
    const signup = useAuthStore((state) => state.signup);
    const isSigningUp = useAuthStore((state) => state.isSigningUp);

    // Security check on component mount
    useEffect(() => {
        const timer = setTimeout(() => setSecurityCheck(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phoneNo) {
            toast.error('All fields are required!');
            return;
        }
 if (!/^\d{10}$/.test(formData.phoneNo)) {
        toast.error('Phone number must be 10 digits');
        return;
    }

         if (!/^[A-Za-z]+$/.test(formData.firstName)) {
            toast.error('First name should contain only alphabets!');
            return;
        }
        if (!/^[A-Za-z]+$/.test(formData.lastName)) {
            toast.error('Last name should contain only alphabets!');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 8 characters!');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // if (!/^\d{10,11}$/.test(formData.phoneNo)) { // Basic phone number validation
        //     toast.error('Please enter a valid phone number');
        //     return;
        // }

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phoneNo: formData.phoneNo,
        };

        try {
            await signup(payload); // Handles toast and error internally
            navigate('/verify?type=admin'); // Navigate to email verification page after signup
        } catch (error) {
            // Error handling from the store should ideally show a toast,
            // but this is a fallback for unexpected errors.
            toast.error('Signup failed. Please try again.');
        }
    };

    // Animation variants (identical to AdminLogin)
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
                                <FiLock className="w-full h-full text-blue-400" /> {/* Changed icon to FiLock */}
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
                            <FiLock className="w-8 h-8 text-white" /> {/* Used FiLock for consistency */}
                        </div>
                        <h2 className="text-3xl font-bold text-white">Admin Signup</h2>
                        <p className="text-gray-400 mt-1">Create your secure admin account</p>
                    </motion.div>

                    {/* Form */}
                    <motion.form onSubmit={handleSubmit} className="space-y-5" variants={containerVariants}>
                        {/* First Name field */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">
                                First Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    placeholder="John"
                                    className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Last Name field */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">
                                Last Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    placeholder="Doe"
                                    className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </motion.div>

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
                                    autoComplete="new-password"
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

                        {/* Phone Number field */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-400 mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiPhone className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="phoneNo"
                                    type="tel"
                                    name="phoneNo"
                                    placeholder="+1234567890"
                                    className="pl-10 input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    value={formData.phoneNo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Submit button */}
                        <motion.div variants={itemVariants} className="pt-2">
                            <motion.button
                                type="submit"
                                className="btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg relative overflow-hidden"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                disabled={isSigningUp}
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {isSigningUp ? (
                                        <>
                                            <FiLoader className="animate-spin mr-2 w-5 h-5" />
                                            Signing Up...
                                        </>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                            </motion.button>
                        </motion.div>
                    </motion.form>

                    {/* Footer links */}
                    <motion.div className="mt-6 text-center space-y-3" variants={containerVariants}>
                        <motion.div variants={itemVariants} className="pt-4 border-t border-gray-700">
                            <p className="text-gray-400 text-sm mb-2">Already have an admin account?</p>
                            <button
                                type="button"
                                className="btn btn-ghost text-purple-400 hover:text-purple-300 border border-gray-700 hover:border-gray-600 w-full py-2 text-sm font-medium transition-all duration-200"
                                onClick={() => navigate('/AdminLogin')}>
                                Login Here
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

export default AdminSignup;
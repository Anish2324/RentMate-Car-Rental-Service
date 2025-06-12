import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiArrowLeft, FiCheckCircle, FiSmartphone, FiDollarSign } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Payment = () => {
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2500);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-2 relative overflow-hidden">
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

      <motion.div
        className="relative w-full max-w-lg bg-[#232946] rounded-3xl shadow-2xl p-8 border border-blue-900 transition-all duration-500 hover:shadow-blue-200"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 to-pink-500/20 opacity-30 blur-sm pointer-events-none"></div>
        <div className="relative">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mb-3">
              <FiCreditCard className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 tracking-tight">
              Payment Options
            </h2>
          </div>
          {success ? (
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <FiCheckCircle className="text-green-400 text-6xl mb-4 animate-bounce" />
              <div className="text-xl font-bold text-green-300 mb-2">Payment Successful!</div>
              <div className="text-blue-100">Thank you for your booking.</div>
            </motion.div>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handlePayment}>
              <div>
                <label className="font-semibold text-blue-100 mb-2 block">Select Payment Method</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                      method === 'card'
                        ? 'bg-blue-500 text-white border-blue-500 scale-105 shadow-lg'
                        : 'bg-[#232946] text-blue-400 border-blue-900 hover:bg-blue-900/20'
                    }`}
                    onClick={() => setMethod('card')}
                  >
                    <FiCreditCard className="w-5 h-5" />
                    Card
                  </button>
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                      method === 'upi'
                        ? 'bg-pink-500 text-white border-pink-500 scale-105 shadow-lg'
                        : 'bg-[#232946] text-pink-400 border-pink-900 hover:bg-pink-900/20'
                    }`}
                    onClick={() => setMethod('upi')}
                  >
                    <FiSmartphone className="w-5 h-5" />
                    UPI
                  </button>
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                      method === 'cod'
                        ? 'bg-green-500 text-white border-green-500 scale-105 shadow-lg'
                        : 'bg-[#232946] text-green-400 border-green-900 hover:bg-green-900/20'
                    }`}
                    onClick={() => setMethod('cod')}
                  >
                    <FiDollarSign className="w-5 h-5" />
                    Cash
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {method === 'card' && (
                  <motion.div
                    className="space-y-3 animate-fade-in"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-blue-900 rounded-lg bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      placeholder="Card Number"
                      required
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        className="w-1/2 px-3 py-2 border border-blue-900 rounded-lg bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="MM/YY"
                        required
                      />
                      <input
                        type="text"
                        className="w-1/2 px-3 py-2 border border-blue-900 rounded-lg bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="CVV"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-blue-900 rounded-lg bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      placeholder="Cardholder Name"
                      required
                    />
                  </motion.div>
                )}
                {method === 'upi' && (
                  <motion.div
                    className="space-y-3 animate-fade-in"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-pink-900 rounded-lg bg-[#181c2f] text-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                      placeholder="Enter UPI ID (e.g. name@bank)"
                      required
                    />
                  </motion.div>
                )}
                {method === 'cod' && (
                  <motion.div
                    className="text-green-400 font-semibold animate-fade-in"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    Pay cash at the time of car pickup. No advance required.
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                type="submit"
                disabled={processing}
                className={`mt-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-blue-600 hover:scale-105 ${
                  processing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
      {/* Security badge */}
      <motion.div
        className="fixed bottom-4 right-4 bg-gray-800/80 backdrop-blur-sm text-xs text-gray-400 px-3 py-2 rounded-full border border-blue-900 flex items-center gap-2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <span>Secure Payment</span>
      </motion.div>
    </div>
  );
};

export default Payment;
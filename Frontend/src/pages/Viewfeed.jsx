import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { FiArrowLeft, FiUser } from 'react-icons/fi';

const Viewfeed = () => {
  const { regNo } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axiosInstance.get(`/feedback/${regNo}`);
        setFeedbacks(res.data.feedbacks || []);
        setCar(res.data.car || regNo);
      } catch (err) {
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [regNo]);

  return (
    <div className="min-h-screen bg-[#181c2f] py-10 px-4 relative">
      {/* Back navigation */}
      <button
        type="button"
        className="fixed top-6 left-6 px-6 py-2 rounded-full bg-gray-800 text-white font-medium shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700 z-50 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft className="w-5 h-5" />
        Back
      </button>
      <div className="max-w-2xl mx-auto bg-[#232946] rounded-2xl shadow-2xl p-8 border border-blue-900 relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-pink-500/20 opacity-30 blur-sm pointer-events-none"></div>
        <div className="relative">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 tracking-tight">
            Feedback for Car Number: <span className="text-blue-300">{car}</span>
          </h2>
          {loading ? (
            <div className="text-center text-lg text-blue-200">Loading...</div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center text-lg text-blue-200">No feedbacks yet for this car.</div>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((fb) => (
                <div
                  key={fb._id}
                  className="bg-[#181c2f] rounded-xl p-5 shadow flex flex-col md:flex-row md:items-center gap-4 border border-blue-900"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-900/30">
                    <FiUser className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-blue-200">{fb.customer?.fullname || 'Customer'}</span>
                      <span className="text-xs text-blue-400">{fb.customer?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-yellow-400 text-lg">
                        {'★'.repeat(fb.rating)}
                        {'☆'.repeat(5 - fb.rating)}
                      </span>
                      <span className="text-blue-200 ml-2">({fb.rating}/5)</span>
                    </div>
                    <div className="text-blue-100 mb-1">{fb.comment}</div>
                    <div className="text-xs text-blue-400">
                      {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Viewfeed;
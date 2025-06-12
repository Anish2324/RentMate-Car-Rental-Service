import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const Booked = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedbackStates, setFeedbackStates] = useState({});
    const [feedbackGiven, setFeedbackGiven] = useState({});

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axiosInstance.get('/book/get-bookings', {
                    withCredentials: true,
                });
                setBookings(res.data.bookings || []);
                // Check for feedback for each booking
                res.data.bookings.forEach(async (booking) => {
                    if (booking.car?.Reg_No) {
                        try {
                            const feedbackRes = await axiosInstance.get(`/feedback/${booking.car.Reg_No}`);
                            const alreadyGiven = feedbackRes.data.feedbacks.some(
                                (fb) => fb.booking === booking._id
                            );
                            setFeedbackGiven(prev => ({
                                ...prev,
                                [booking._id]: alreadyGiven
                            }));
                        } catch {
                            setFeedbackGiven(prev => ({
                                ...prev,
                                [booking._id]: false
                            }));
                        }
                    }
                });
            } catch (err) {
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleFeedbackOpen = (bookingId) => {
        setFeedbackStates((prev) => ({
            ...prev,
            [bookingId]: { rating: '', comment: '', open: true, submitting: false }
        }));
    };

    const handleFeedbackChange = (bookingId, field, value) => {
        setFeedbackStates((prev) => ({
            ...prev,
            [bookingId]: { ...prev[bookingId], [field]: value }
        }));
    };

    const handleFeedbackSubmit = async (booking) => {
        const state = feedbackStates[booking._id];
        if (!state.rating) {
            toast.error('Please provide a rating.');
            return;
        }
        setFeedbackStates((prev) => ({
            ...prev,
            [booking._id]: { ...prev[booking._id], submitting: true }
        }));
        try {
            await axiosInstance.post(
                `/feedback/${booking.car?.Reg_No}`,
                { rating: state.rating, comment: state.comment, bookingId: booking._id },
                { withCredentials: true }
            );

            toast.success('Feedback submitted!');
            setFeedbackStates((prev) => ({
                ...prev,
                [booking._id]: { ...prev[booking._id], open: false }
            }));
            setFeedbackGiven((prev) => ({
                ...prev,
                [booking._id]: true
            }));
        } catch (err) {
            toast.error(
                err?.response?.data?.message || 'Failed to submit feedback'
            );
        } finally {
            setFeedbackStates((prev) => ({
                ...prev,
                [booking._id]: { ...prev[booking._id], submitting: false }
            }));
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 bg-[#181c2f]">
            <h2 className="text-3xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 drop-shadow-lg">
                My Booked Cars
            </h2>
            {loading ? (
                <div className="text-center text-lg text-blue-200">Loading...</div>
            ) : bookings.length === 0 ? (
                <div className="text-center text-lg text-blue-200">No bookings found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-[#232946] rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center border border-blue-900 hover:shadow-2xl transition-shadow duration-300"
                        >
                            <img
                                src={
                                    booking.car?.image_url
                                        ? booking.car.image_url.startsWith('http')
                                            ? booking.car.image_url
                                            : `http://localhost:5000/${booking.car.image_url}`
                                        : '/default-car.png'
                                }
                                alt={booking.car?.Car_Model || 'Car'}
                                className="w-44 h-32 object-cover rounded-xl mb-4 md:mb-0 md:mr-8 border-4 border-blue-900 shadow"
                            />
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2 text-blue-200">
                                    {booking.car?.Car_company} {booking.car?.Car_Model}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-blue-100 text-base mb-2">
                                    <span>
                                        <span className="font-semibold">Reg No:</span> {booking.car?.Reg_No || 'N/A'}
                                    </span>
                                    <span>
                                        <span className="font-semibold">Category:</span> {booking.car?.car_category || 'N/A'}
                                    </span>
                                    <span>
                                        <span className="font-semibold">Booking Date:</span>{' '}
                                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                    <span>
                                        <span className="font-semibold">From:</span> {booking.starting_date || 'N/A'}
                                    </span>
                                    <span>
                                        <span className="font-semibold">No. of Days:</span> {booking.no_of_days}
                                    </span>
                                    <span>
                                        <span className="font-semibold">Total Cost:</span> ₹{booking.cost}
                                    </span>
                                    <span>
                                        <span className="font-semibold">Status:</span> {booking.status || 'Booked'}
                                    </span>
                                </div>
                                {/* Feedback Button and Form */}
                                {feedbackGiven[booking._id] ? (
                                    <div className="mt-4 text-green-400 font-semibold">Feedback Submitted</div>
                                ) : !feedbackStates[booking._id]?.open ? (
                                    <button
                                        className="mt-4 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white px-5 py-2 rounded-lg font-bold shadow hover:from-fuchsia-600 hover:to-blue-600 transition"
                                        onClick={() => handleFeedbackOpen(booking._id)}
                                    >
                                        Add Feedback
                                    </button>
                                ) : (
                                    <div className="mt-4 p-4 bg-[#181c2f] rounded-xl shadow-inner border border-blue-900">
                                        <div className="mb-2">
                                            <label className="font-semibold mr-2 text-blue-100">Rating:</label>
                                            <select
                                                value={feedbackStates[booking._id]?.rating}
                                                onChange={e =>
                                                    handleFeedbackChange(booking._id, 'rating', e.target.value)
                                                }
                                                className="border border-blue-900 rounded px-2 py-1 bg-[#232946] text-blue-100"
                                            >
                                                <option value="">Select</option>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label className="font-semibold text-blue-100 mr-2">Comment:</label>
                                            <input
                                                type="text"
                                                value={feedbackStates[booking._id]?.comment}
                                                onChange={e =>
                                                    handleFeedbackChange(booking._id, 'comment', e.target.value)
                                                }
                                                className="border border-blue-900 rounded px-2 py-1 w-full bg-[#232946] text-blue-100"
                                                placeholder="Write your feedback..."
                                            />
                                        </div>
                                        <button
                                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-1 rounded font-semibold mt-2 transition"
                                            onClick={() => handleFeedbackSubmit(booking)}
                                            disabled={feedbackStates[booking._id]?.submitting}
                                        >
                                            {feedbackStates[booking._id]?.submitting ? 'Submitting...' : 'Submit'}
                                        </button>
                                        <button
                                            className="ml-4 text-red-400 underline"
                                            onClick={() =>
                                                setFeedbackStates((prev) => ({
                                                    ...prev,
                                                    [booking._id]: { ...prev[booking._id], open: false }
                                                }))
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Booked;
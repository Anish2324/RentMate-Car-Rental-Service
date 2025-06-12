import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import { FiArrowLeft } from 'react-icons/fi';

const Economy = () => {
  const [newCars, setNewCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const setBookedCar = useBookingStore((state) => state.setBookedCar);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/car/get-cars?category=economical')
      .then(res => setNewCars(res.data.cars || []))
      .finally(() => setLoading(false));
  }, []);

  const handleBookNow = (car) => {
    setBookedCar(car);
    navigate('/booking');
  };

  const handleViewFeedback = (car) => {
    navigate(`/viewfeed/${car.Reg_No}`);
  };

  return (
    <div className="min-h-screen bg-[#181c2f] py-10 px-4">
      {/* Back navigation */}
      <button
        className="fixed top-6 left-6 px-6 py-2 rounded-full bg-gray-800 text-white font-medium shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700 z-50 flex items-center gap-2"
        onClick={() => navigate('/viewcars')}
      >
        <FiArrowLeft className="w-5 h-5" />
        Categories
      </button>
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 drop-shadow-lg">
        Top Economy Cars
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {loading ? (
          <div className="col-span-3 text-center text-lg text-blue-200">Loading...</div>
        ) : newCars.length === 0 ? (
          <div className="col-span-3 text-center text-lg text-blue-200">No economy cars found.</div>
        ) : (
          newCars.map((car) => (
            <div
              key={car._id}
              className="bg-[#232946] rounded-2xl shadow-2xl p-5 flex flex-col transition-all duration-300 hover:scale-105 border border-blue-900 relative"
            >
              <div className="relative">
                {car.image_url ? (
                  <img
                    src={car.image_url}
                    alt={car.Car_Model}
                    className="rounded-xl w-full h-48 object-cover border-4 border-blue-900 shadow"
                  />
                ) : (
                  <div className="rounded-xl w-full h-48 bg-gray-700 flex items-center justify-center text-blue-300 border-4 border-blue-900">
                    No Image
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-lg shadow">
                  {car.rental_rate ? `₹${car.rental_rate}/day` : ''}
                </span>
              </div>
              <div className="mt-4 flex-1 flex flex-col gap-1">
                <h2 className="text-xl text-blue-100 font-bold mb-1">
                  {car.Car_company} {car.Car_Model}
                </h2>
                <div className="text-blue-200 text-sm">
                  <span className="font-semibold">Reg No:</span> {car.Reg_No}
                </div>
                <div className="text-blue-200 text-sm">
                  <span className="font-semibold">Year:</span> {car.year}
                </div>
                <div className="text-blue-300 text-sm">
                  <span className="font-semibold">Availability:</span>{' '}
                  {car.availability === 'true' || car.availability === true
                    ? <span className="text-green-400 font-semibold">Available</span>
                    : <span className="text-red-400 font-semibold">Unavailable</span>}
                </div>
                <div className="text-blue-300 text-sm">
                  <span className="font-semibold">Fuel:</span> {car.fuel} &nbsp;|&nbsp;
                  <span className="font-semibold">Seats:</span> {car.seats}
                </div>
                <div className="text-blue-300 text-sm">
                  <span className="font-semibold">Location:</span>{' '}
                  {car.location?.street}, {car.location?.city} - {car.location?.pincode}
                </div>
                <button
                  className="mt-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-blue-600 hover:scale-105 transition"
                  onClick={() => handleBookNow(car)}
                >
                  Book Now
                </button>
                <button
                  className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition"
                  onClick={() => handleViewFeedback(car)}
                >
                  View Feedback
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Economy;
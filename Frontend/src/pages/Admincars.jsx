import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get('/car/my-cars')
      .then((res) => setCars(res.data.cars || []))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteCar = async (Reg_No) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axiosInstance.delete(`/car/delete/${Reg_No}`);
        setCars((prev) => prev.filter((car) => car.Reg_No !== Reg_No));
      } catch (err) {
        alert('Failed to delete car.');
      }
    }
  };

  const handleEditCar = (Reg_No) => {
    navigate(`/editcar/${Reg_No}`);
  };

  return (
    <div className="min-h-screen bg-[#181c2f] py-10 px-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto mb-8">
        <button
          className="bg-gray-800 text-white px-6 py-2 rounded-full font-semibold shadow-lg border border-gray-700 hover:bg-gray-700 transition-all duration-200"
          onClick={() => navigate('/')}
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 flex-1">
          Your Added Cars
        </h1>
        <div className="w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="col-span-3 text-center text-lg text-blue-200">Loading...</div>
        ) : cars.length === 0 ? (
          <div className="col-span-3 text-center text-lg text-blue-200">No cars found.</div>
        ) : (
          cars.map((car) => (
            <div
              key={car._id}
              className="bg-[#232946] rounded-2xl shadow-2xl p-5 flex flex-col transition-all duration-300 hover:scale-105 relative border border-blue-900"
            >
              {/* Edit icon */}
              <button
                className="absolute top-3 left-3 z-20 bg-blue-900/80 rounded-full p-2 shadow hover:bg-blue-700 transition"
                style={{ color: '#fff' }}
                onClick={() => handleEditCar(car.Reg_No)}
                title="Edit Car"
              >
                <FaPencilAlt />
              </button>
              {/* Delete icon */}
              <button
                className="absolute top-3 right-3 z-20 bg-red-900/80 rounded-full p-2 shadow hover:bg-red-700 transition"
                style={{ color: '#fff' }}
                onClick={() => handleDeleteCar(car.Reg_No)}
                title="Delete Car"
              >
                <FaTrash />
              </button>
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
                <span className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-lg shadow">
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCars;
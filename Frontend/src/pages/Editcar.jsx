import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { FiArrowLeft } from 'react-icons/fi';

const EditCar = () => {
  const { Reg_No } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [rental_rate, setRentalRate] = useState('');
  const [availability, setAvailability] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch car details by Reg_No
    axiosInstance
      .get(`/car/get-cars?reg_no=${Reg_No}`)
      .then((res) => {
        const foundCar = res.data.cars.find((c) => c.Reg_No === Reg_No);
        if (!foundCar) throw new Error('Car not found');
        setCar(foundCar);
        setRentalRate(foundCar.rental_rate);
        setAvailability(
          foundCar.availability === true || foundCar.availability === 'true'
            ? 'true'
            : 'false'
        );
      })
      .catch(() => {
        alert('Failed to fetch car details');
        navigate('/getcars');
      })
      .finally(() => setLoading(false));
  }, [Reg_No, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/car/update/${Reg_No}`, {
        rental_rate,
        availability: availability === 'true',
      });
      alert('Car updated successfully!');
      navigate('/getcars');
    } catch (err) {
      alert('Failed to update car.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#181c2f]">
        <div className="text-lg text-blue-200">Loading...</div>
      </div>
    );
  }

  if (!car) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Back navigation */}
      <button
        type="button"
        onClick={() => navigate('/getcars')}
        className="fixed top-6 left-6 px-6 py-2 rounded-full bg-gray-800 text-white font-medium shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700 z-50 flex items-center gap-2"
      >
        <FiArrowLeft className="w-5 h-5" />
        Back to Cars
      </button>
      <div className="relative bg-[#232946] shadow-2xl rounded-3xl p-10 w-full max-w-md border border-blue-900">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 to-pink-500/20 opacity-30 blur-sm pointer-events-none"></div>
        <div className="relative">
          <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 mb-8">
            Edit Car Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-1 text-blue-100">Registration Number</label>
              <input
                type="text"
                value={car.Reg_No}
                disabled
                className="input input-bordered w-full bg-gray-700 text-blue-200 border-blue-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-100">Rental Rate</label>
              <input
                type="number"
                value={rental_rate}
                onChange={(e) => setRentalRate(e.target.value)}
                className="input input-bordered w-full bg-gray-700 text-blue-200 border-blue-900 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-100">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="select select-bordered w-full bg-gray-700 text-blue-200 border-blue-900 focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-600 hover:from-pink-600 hover:to-blue-600 text-white w-full py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCar;
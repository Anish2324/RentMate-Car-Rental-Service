import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCarStore from '../store/useCarstore';
import { FiArrowLeft, FiPlusCircle, FiImage, FiLoader } from 'react-icons/fi';

const AddCar = () => {
  const {
    formData,
    imageFile,
    loading,
    setFormField,
    setImageFile,
    resetForm,
    addCar,
  } = useCarStore();

  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormField(name, value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file); // Set image file in the store

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImg(reader.result); // For preview
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addCar();
    if (success) {
      navigate('/getcars');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Back navigation */}
      <button
        type="button"
        className="fixed top-6 left-6 px-6 py-2 rounded-full bg-gray-800 text-white font-medium shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700 z-50 flex items-center gap-2"
        onClick={() => navigate('/')}
      >
        <FiArrowLeft className="w-5 h-5" />
        Dashboard
      </button>

      <div className="backdrop-blur-lg bg-gray-800/90 shadow-xl rounded-xl p-8 w-full max-w-2xl border border-gray-700 relative z-10">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-30 blur-sm"></div>
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <FiPlusCircle className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Add Car</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/getcars')}
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow border border-purple-700 transition-all duration-200"
            >
              My Cars
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { name: 'Reg_No', type: 'text', placeholder: 'Registration Number' },
                { name: 'year', type: 'number', placeholder: 'Year' },
                { name: 'Car_company', type: 'text', placeholder: 'Car Company' },
                { name: 'Car_Model', type: 'text', placeholder: 'Car Model' },
                { name: 'rental_rate', type: 'number', placeholder: 'Rental Rate' },
                { name: 'seats', type: 'number', placeholder: 'Seats' },
                { name: 'city', type: 'text', placeholder: 'City' },
                { name: 'street', type: 'text', placeholder: 'Street' },
                { name: 'pincode', type: 'text', placeholder: 'Pincode' },
              ].map(({ name, type, placeholder }) => (
                <input
                  key={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  className="input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={formData[name]}
                  onChange={handleChange}
                  required
                />
              ))}

              {/* Fuel */}
              <select
                name="fuel"
                className="select select-bordered w-full bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={formData.fuel}
                onChange={handleChange}
                required
              >
                <option value="">Select Fuel Type</option>
                <option value="electric">Electric</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
              </select>

              {/* Car Category */}
              <select
                name="car_category"
                className="select select-bordered w-full bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={formData.car_category}
                onChange={handleChange}
                required
              >
                <option value="">Select Car Category</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
                <option value="economical">Economical</option>
              </select>

              {/* Availability */}
              <select
                name="availability"
                className="select select-bordered w-full bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={formData.availability}
                onChange={handleChange}
                required
              >
                <option value="">Select Availability</option>
                <option value={true}>Available</option>
                <option value={false}>Unavailable</option>
              </select>
            </div>

            {/* Car Image Upload */}
            <div className="flex flex-col items-center gap-2">
              <label className="font-semibold text-gray-300 flex items-center gap-2">
                <FiImage className="w-5 h-5" />
                Car Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full max-w-md bg-gray-700 border-gray-600 text-white"
                required
              />
              {selectedImg && (
                <img
                  src={selectedImg}
                  alt="Preview"
                  className="mt-4 rounded-xl shadow-lg w-60 h-60 object-cover border-4 border-blue-400"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin w-5 h-5" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <FiPlusCircle className="w-5 h-5" />
                  <span>Add Car</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
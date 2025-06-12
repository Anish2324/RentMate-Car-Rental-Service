import React, { useState } from 'react';
import economyCarImg from '../images/Economy car.png';
import suv from '../images/suv.png';
import luxury from '../images/luxury.png';
import electric from '../images/sedan.png';
import { useNavigate } from 'react-router-dom';

const carCategories = [
  {
    name: 'Economy Car',
    description: 'Affordable, fuel-efficient hatchbacks perfect for city driving and budget rentals.',
    image: economyCarImg
  },
  {
    name: 'SUV',
    description: 'Spacious and powerful SUVs, ideal for families or adventure trips.',
    imgAlt: 'SUV - add image here',
    image: suv
  },
  {
    name: 'Luxury Car',
    description: 'Premium sedans with luxury features for a comfortable and stylish ride.',
    imgAlt: 'Luxury Car - add image here',
    image: luxury
  },
  {
    name: 'Sedan',
    description: 'Comfortable sedans for smooth city and highway rides, perfect for families and business trips.',
    imgAlt: 'Sedan - add image here',
    image: electric
  },
];

const Viewcars = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredCars = carCategories.filter(car =>
    car.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-4 bg-[#181c2f] transition-all duration-500">
      <div className="flex justify-between items-center mb-10 max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 drop-shadow-lg transition-all duration-500">
          Search Car Categories
        </h1>
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl font-semibold shadow-lg border border-blue-900 transition-all duration-300"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </button>
      </div>
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search by category (e.g. SUV, Luxury)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-md bg-[#232946] border-blue-900 text-blue-100 placeholder-blue-300 focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 transition-all duration-300"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {filteredCars.map((car, idx) => (
          <div
            key={car.name}
            className="bg-[#232946] rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center border border-blue-900 hover:shadow-fuchsia-700/40 transition-all duration-500 hover:scale-105 group"
          >
            <div className="w-44 h-32 bg-[#181c2f] rounded-xl flex items-center justify-center mb-4 md:mb-0 md:mr-8 shadow-lg overflow-hidden transition-all duration-500 group-hover:scale-110 border border-blue-900">
              {car.image ? (
                <img src={car.image} alt={car.name} className="object-contain w-full h-full transition-all duration-500" />
              ) : (
                <span className="text-blue-300 text-sm text-center">{car.imgAlt}</span>
              )}
            </div>
            <div className="flex-1 flex flex-col items-start">
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 transition-all duration-500">
                {car.name}
              </h2>
              <p className="text-blue-200 mb-6">{car.description}</p>
              <button
                className="mt-auto bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-600 hover:from-pink-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  if (car.name === 'Economy Car') {
                    navigate('/economy');
                  } else if (car.name === 'SUV') {
                    navigate('/suv');
                  } else if (car.name === 'Luxury Car') {
                    navigate('/luxury');
                  } else if (car.name === 'Sedan') {
                    navigate('/sedan');
                  }
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
        {filteredCars.length === 0 && (
          <div className="col-span-full text-center text-blue-300 text-xl animate-pulse">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewcars;
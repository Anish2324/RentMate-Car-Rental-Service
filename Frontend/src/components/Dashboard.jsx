import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import cover from '../images/cover2.jpg';

const steps = [
  {
    title: "Register as Admin",
    description: (
      <>
        Go to <span className="text-blue-600 font-semibold">Admin Register</span> and create your admin account.
      </>
    ),
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Login as Admin",
    description: (
      <>
        Use your credentials on the <span className="text-blue-600 font-semibold">Admin Login</span> page.
      </>
    ),
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
  },
  {
    title: "Add Cars",
    description: (
      <>
        After logging in, navigate to <span className="text-blue-600 font-semibold">Add Car</span> to add new cars to the platform.
      </>
    ),
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "Manage Cars",
    description: (
      <>
        You can view, edit, or remove cars as an admin from the admin dashboard.
      </>
    ),
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h18" />
      </svg>
    ),
  },
];

const advantages = [
  {
    title: "Wide Selection",
    description: "Choose from a wide range of cars for every need and budget.",
    icon: (
      <svg className="w-10 h-10 text-blue-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="7" rx="2" stroke="currentColor" />
        <circle cx="7.5" cy="18.5" r="1.5" fill="currentColor" />
        <circle cx="16.5" cy="18.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Affordable Pricing",
    description: "Competitive rates and transparent pricing with no hidden charges.",
    icon: (
      <svg className="w-10 h-10 text-green-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m0 0c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    description: "Our support team is available round the clock for your assistance.",
    icon: (
      <svg className="w-10 h-10 text-pink-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v.01M12 8v4" />
      </svg>
    ),
  },
  {
    title: "Easy Booking",
    description: "Book your car in just a few clicks with our user-friendly platform.",
    icon: (
      <svg className="w-10 h-10 text-yellow-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
      </svg>
    ),
  },
  {
    title: "Trusted & Secure",
    description: "Your safety and privacy are our top priorities at every step.",
    icon: (
      <svg className="w-10 h-10 text-purple-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V7l7-4z" />
      </svg>
    ),
  },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex bg-[#181c2f] min-h-screen">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onMenuClick={toggleSidebar} />

      {/* Main Content */}
      <div className={`w-full ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
     
        <Navbar onMenuClick={toggleSidebar} open={sidebarOpen} />
        
        {/* Cover Image Section - now sits below Navbar */}
              <div className="w-full flex justify-center items-center mb-8 mt-20">
          <div className="relative w-full">
            <img
              src={cover}
              alt="Dashboard Cover"
              className="w-full shadow-xl object-cover max-h-[340px] min-h-[180px]"
            />
            {/* Solid overlay instead of gradient */}
            <div className="absolute inset-0 bg-[#181c2f]/70 "></div>
            <div className="absolute inset-0 flex flex-col items-start justify-start p-8">
              <h3 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg bg-[#181c2f]/80 px-6 py-2 rounded-xl mt-2">
                Enjoy Your Journey with Us!!!
              </h3>
              <p className="mt-4 text-red-400 text-3xl font-semibold animate-fade-in-out">
                Welcome guys!!
              </p>
            </div>
          </div>
        </div>
        {/* Interactive Instructions Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <h4 className="text-2xl font-bold text-blue-300 mb-6 text-center">How to Become an Admin &amp; Add Cars</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-[#232946] rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border border-blue-900"
              >
                <div className="mb-3">{step.icon}</div>
                <div className="text-lg font-semibold text-blue-100 mb-1">{step.title}</div>
                <div className="text-blue-200 text-center">{step.description}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-blue-200 text-sm text-center">
            <span className="font-semibold">Note:</span> Only admins can add or manage cars. Customers can browse and book cars after registering and logging in as a customer.
          </p>
        </div>
        {/* Customer Steps Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h4 className="text-2xl font-bold text-pink-400 mb-6 text-center">How to Rent a Car as a Customer</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center bg-[#232946] rounded-xl shadow-lg p-6 border border-pink-900">
              <svg className="w-8 h-8 text-pink-400 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="text-lg font-semibold text-blue-100 mb-1">Register as Customer</div>
              <div className="text-blue-200 text-center">
                Go to <span className="text-pink-400 font-semibold">Customer Register</span> and create your customer account.
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#232946] rounded-xl shadow-lg p-6 border border-pink-900">
              <svg className="w-8 h-8 text-green-400 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div className="text-lg font-semibold text-blue-100 mb-1">Login as Customer</div>
              <div className="text-blue-200 text-center">
                Use your credentials on the <span className="text-pink-400 font-semibold">Customer Login</span> page.
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#232946] rounded-xl shadow-lg p-6 border border-pink-900">
              <svg className="w-8 h-8 text-blue-400 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              <div className="text-lg font-semibold text-blue-100 mb-1">Browse &amp; Select Car</div>
              <div className="text-blue-200 text-center">
                Browse available cars by category and select the car you want to rent.
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#232946] rounded-xl shadow-lg p-6 border border-pink-900">
              <svg className="w-8 h-8 text-purple-400 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-lg font-semibold text-blue-100 mb-1">Book &amp; Pay</div>
              <div className="text-blue-200 text-center">
                Click <span className="text-pink-400 font-semibold">Book Now</span>, fill in your details, and complete the payment to confirm your booking.
              </div>
            </div>
          </div>
          <p className="mt-8 text-blue-200 text-sm text-center">
            <span className="font-semibold">Tip:</span> After your trip, you can add feedback for the car you rented!
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <h4 className="text-3xl font-bold text-center text-blue-200 mb-10">Why Choose Us?</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((adv, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-[#232946] rounded-2xl shadow-lg p-8 border border-blue-900 hover:shadow-2xl transition-shadow duration-300"
              >
                {adv.icon}
                <div className="text-xl font-semibold text-blue-100 mb-2 text-center">{adv.title}</div>
                <div className="text-blue-200 text-center text-lg">{adv.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Info Section - now consistent width and flex */}
        <div className="max-w-5xl mx-auto px-8 bg-[#232946] py-14 mt-8 rounded-2xl shadow-lg border border-blue-900">
          <h5 className="text-4xl font-bold text-blue-200 mb-8 flex items-center gap-4">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Contact &amp; Company Information
          </h5>
          <div className="flex flex-col md:flex-row md:justify-between gap-12 mb-8">
            <div className="flex-1 min-w-[250px] flex flex-col gap-4">
              <div className="text-blue-100 text-1xl">
                <span className="font-semibold">Address:</span> Aryabhata Block, MSRIT<br />
                Bengaluru, Karnataka, 560001, India
              </div>
              <div className="text-blue-100 text-1xl">
                <span className="font-semibold">Head Office:</span> RMZ Ecoworld, Building 6B,<br />
                Outer Ring Road, Devarabeesanahalli,<br />Whitefield, Bengaluru, Karnataka, 560066, India
              </div>
              <div className="text-blue-100 text-1xl">
                <span className="font-semibold">Phone:</span> <a href="tel:+919876543210" className="text-blue-400 hover:underline">+91 98765 43210</a>
              </div>
              <div className="text-blue-100 text-1xl">
                <span className="font-semibold">Email:</span> <a href="mailto:support@rentmate.com" className="text-blue-400 hover:underline">support@rentmate.com</a>
              </div>
              <div className="text-blue-100 mt-6 text-xl">
                <span className="font-semibold">Available In:</span>
                <ul className="list-disc list-inside ml-4 mt-2 text-blue-100 text-xl grid grid-cols-2 gap-x-8">
                  <li>Bangalore</li>
                  <li>Mumbai</li>
                  <li>Chennai</li>
                  <li>Hyderabad</li>
                  <li>Delhi</li>
                  <li>Pune</li>
                  <li>Kolkata</li>
                  <li>Dubai</li>
                  <li>Abu Dhabi</li>
                  <li>Sharjah</li>
                </ul>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <svg className="w-48 h-48 text-blue-900" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
                <rect x="8" y="16" width="32" height="16" rx="4" fill="#232946" />
                <path d="M12 32v2a2 2 0 002 2h20a2 2 0 002-2v-2" stroke="#60a5fa" strokeWidth="2" />
                <circle cx="16" cy="36" r="2" fill="#60a5fa" />
                <circle cx="32" cy="36" r="2" fill="#60a5fa" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { FaCar, FaHome, FaBars, FaInfoCircle, FaClipboardList, FaTachometerAlt } from 'react-icons/fa';
import { MdAddCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Sidebar = ({ open, onMenuClick }) => {
  const navigate = useNavigate();

  // Toast handler for About Us
  const handleAboutClick = () => {
    toast('About Us functionality coming soon!');
  };

  return (
    <div
      className={`
        fixed z-30 left-0
        top-20
        h-[calc(100vh-5rem)]
        transition-all duration-500
        ${open ? 'w-64 px-4 py-6' : 'w-16 px-0 py-6'}
        bg-[#181c2f] border-r border-blue-900 shadow-xl
      `}
    >
      {/* Collapsed menu button */}
      {!open && (
        <div className="flex justify-center mb-8">
          <FaBars
            className="text-blue-400 hover:text-fuchsia-400 w-7 h-7 cursor-pointer transition-all duration-200"
            onClick={onMenuClick}
            title="Open Sidebar"
          />
        </div>
      )}

      {open ? (
        <>
          <div className="flex items-center gap-3 mb-8">
            <FaTachometerAlt className="w-7 h-7 text-blue-400" />
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 drop-shadow-lg tracking-wide">
              DashBoard
            </span>
          </div>
          <hr className="border-blue-900 mb-6" />

          <ul className="space-y-2 text-blue-100 font-semibold">
            <li>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900/60 transition-all duration-200 group"
                onClick={() => navigate('/')}
              >
                <FaHome className="w-6 h-6 text-blue-300 group-hover:text-fuchsia-400 transition-all duration-200" />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-fuchsia-900/60 transition-all duration-200 group"
                onClick={() => navigate('/addcar')}
              >
                <MdAddCircle className="w-6 h-6 text-fuchsia-300 group-hover:text-blue-400 transition-all duration-200" />
                <span>Add Cars</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-900/60 transition-all duration-200 group"
                onClick={() => navigate('/viewcars')}
              >
                <FaCar className="w-6 h-6 text-purple-300 group-hover:text-pink-400 transition-all duration-200" />
                <span>View Cars</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-900/60 transition-all duration-200 group"
                onClick={() => navigate('/booked')}
              >
                <FaClipboardList className="w-6 h-6 text-green-300 group-hover:text-blue-400 transition-all duration-200" />
                <span>Booked Cars</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-900/60 transition-all duration-200 group"
                onClick={handleAboutClick}
              >
                <FaInfoCircle className="w-6 h-6 text-blue-200 group-hover:text-fuchsia-400 transition-all duration-200" />
                <span>About Us</span>
              </button>
            </li>
          </ul>
        </>
      ) : (
        // Only icons when closed
        <ul className="flex flex-col items-center mt-8 text-blue-100 space-y-8">
          <li className="hover:bg-blue-900/60 p-2 rounded-lg transition-all duration-200">
            <button onClick={() => navigate('/')}>
              <FaHome className="w-6 h-6" title="Home" />
            </button>
          </li>
          <li className="hover:bg-fuchsia-900/60 p-2 rounded-lg transition-all duration-200">
            <button onClick={() => navigate('/addcar')}>
              <MdAddCircle className="w-6 h-6" title="Add Cars" />
            </button>
          </li>
          <li className="hover:bg-purple-900/60 p-2 rounded-lg transition-all duration-200">
            <button onClick={() => navigate('/viewcars')}>
              <FaCar className="w-6 h-6" title="View Cars" />
            </button>
          </li>
          <li className="hover:bg-green-900/60 p-2 rounded-lg transition-all duration-200">
            <button onClick={() => navigate('/booked')}>
              <FaClipboardList className="w-6 h-6" title="Booking Details" />
            </button>
          </li>
          <li className="hover:bg-blue-900/60 p-2 rounded-lg transition-all duration-200">
            <button onClick={handleAboutClick}>
              <FaInfoCircle className="w-6 h-6" title="About Us" />
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
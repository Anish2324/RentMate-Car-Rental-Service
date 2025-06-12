import React, { useState, useEffect, useRef } from 'react';
import { useCustomerAuthStore } from '../store/useCustomerAuthStore';
import { axiosInstance } from '../lib/axios';
import { FiCamera, FiUser, FiMail, FiMapPin, FiPhone, FiSave } from 'react-icons/fi';

const Profile = () => {
  // Use separate selectors to avoid infinite loop
  const customer = useCustomerAuthStore((state) => state.customer);
  const setCustomer = useCustomerAuthStore((state) => state.setCustomer);

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phoneNo: '',
    address: '',
    city: '',
    pincode: '',
    photo: '',
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (customer) {
      setForm({
        fullname: customer.fullname || '',
        email: customer.email || '',
        phoneNo: customer.phoneNo || '',
        address: customer.address || '',
        city: customer.city || '',
        pincode: customer.pincode || '',
        photo: customer.photo || '',
      });
      setPhotoPreview(customer.photo ? customer.photo : '');
    }
  }, [customer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let photoUrl = form.photo;
      if (form.photo && form.photo instanceof File) {
        const data = new FormData();
        data.append('photo', form.photo);
        const res = await axiosInstance.post('/customer/upload-photo', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoUrl = res.data.photoUrl;
      }
      const updated = {
        ...form,
        photo: photoUrl,
      };
      await axiosInstance.put('/customer/update-profile', updated);
      if (setCustomer) setCustomer(updated);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-2">
      <div className="relative w-full max-w-lg bg-[#232946] rounded-3xl shadow-2xl p-8 border border-blue-900">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 to-pink-500/20 opacity-30 blur-sm pointer-events-none"></div>
        <div className="relative flex flex-col items-center">
          <div className="relative mb-6">
            <div
              className="w-28 h-28 rounded-full bg-blue-900/30 flex items-center justify-center shadow-lg overflow-hidden border-4 border-blue-900 cursor-pointer group"
              onClick={handlePhotoClick}
              title="Change Photo"
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <FiUser className="w-16 h-16 text-blue-400" />
              )}
              <div className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full shadow group-hover:bg-pink-500 transition">
                <FiCamera className="text-white w-5 h-5" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 mb-6">
            My Profile
          </h2>
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-blue-100 font-semibold mb-1 flex items-center gap-2">
                <FiUser /> Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-900 rounded-lg bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-blue-100 font-semibold mb-1 flex items-center gap-2">
                <FiMail /> Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-900 rounded-lg bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-blue-100 font-semibold mb-1 flex items-center gap-2">
                <FiPhone /> Phone Number
              </label>
              <input
                type="text"
                name="phoneNo"
                value={form.phoneNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-900 rounded-lg bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-blue-100 font-semibold mb-1 flex items-center gap-2">
                <FiMapPin /> Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-900 rounded-lg bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-blue-100 font-semibold mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-900 rounded-lg bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-blue-100 font-semibold mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-900 rounded-lg bg-[#181c2f] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-pink-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
              disabled={saving}
            >
              <FiSave className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
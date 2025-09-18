import React, { useContext, useState, useEffect } from 'react';
import { appContext } from '../components/appContext';
import { accountDetail, updateProfile } from '../../serverLayer';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfileUpdate = () => {
  const { user, loginStatus, loading } = useContext(appContext);
  const [detail, setDetail] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    picture: null,
  });
  const [previewPic, setPreviewPic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Fetch details
  useEffect(() => {
    async function fetchDetails() {
      if (loading) return;

      if (!loginStatus) {
        navigate('/login');
        return;
      }
      if (!user) return;

      try {
        const data = await accountDetail(user.id);
        setDetail(data);
      } catch (err) {
        console.error('Failed to load account details:', err);
      }
    }

    fetchDetails();
  }, [user, loginStatus, loading, navigate]);

  // When detail changes, update formData
  useEffect(() => {
    if (detail) {
      setFormData({
        name: detail.name || '',
        email: detail.email || '',
        phone: detail.phone || '',
        address: detail.address || '',
        password: '',
        confirmPassword: '',
        picture: null,
      });

      if (detail.pic) {
        setPreviewPic(
          detail.pic.url
        );
      }
    }
  }, [detail]);

  // Handle file change with preview
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, picture: file });
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await updateProfile(
      user.id,
      formData.name,
      formData.email,
      formData.phone,
      formData.address,
      formData.password,
      formData.confirmPassword,
      formData.picture
    );

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (response.status === 200) {
      toast.success('🎉 Profile Updated Successfully!');
      navigate('/detail');
    } else {
      const errors = response?.errors || [];
      errors.forEach((msg) => toast.error(msg.message));
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="relative w-20 h-20">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-cyan-500 animate-spin"></div>

          {/* Inner Pulse */}
          <div className="absolute inset-3 rounded-full bg-cyan-500 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 px-4">
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-30 z-50">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-bold text-center mb-6 Caprasimo text-cyan-600">
            Task Manager
          </h2>
          <h3 className="text-xl font-semibold text-center mb-6 Prompt text-gray-800">
            Update Profile
          </h3>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1 Roboto">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 Roboto">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1 Roboto">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1 Roboto">
                Address
              </label>
              <textarea
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
                rows="2"
              ></textarea>
            </div>

            {/* Picture */}
            <div>
              <label className="block text-sm font-medium mb-1 Roboto">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePicChange}
                className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 
                           file:rounded-lg file:border-0 file:text-sm file:font-medium 
                           file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
              />
              {previewPic && (
                <img
                  src={previewPic}
                  alt="Preview"
                  className="mt-3 w-32 h-32 object-cover rounded-full border shadow-sm mx-auto"
                />
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1 Roboto">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1 Roboto">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
              />
            </div>

            {/* Show Password Option */}
            <div className="flex items-center space-x-2 text-sm Roboto">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 text-cyan-600 rounded"
              />
              <label htmlFor="showPassword" className="cursor-pointer">
                Show Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg 
                         cursor-pointer font-medium transition transform hover:scale-105 Prompt"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileUpdate;

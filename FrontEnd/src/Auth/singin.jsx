import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInHandling } from '../../serverLayer';
import toast from 'react-hot-toast';

const Signup = () => {
  const name = useRef('');
  const email = useRef('');
  const phone = useRef('');
  const address = useRef('');
  const password = useRef('');
  const confirmPassword = useRef('');
  const picture = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [previewPic, setPreviewPic] = useState(null);
  const [fileName, setFileName] = useState('');

  const navigate = useNavigate();

  // ✅ Handle Picture Upload + Preview
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setPreviewPic(URL.createObjectURL(file));
    } else {
      setFileName('');
      setPreviewPic(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await signInHandling(
      name,
      email,
      phone,
      address,
      password,
      confirmPassword,
      picture
    );

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (response.status === 201) {
      toast.success('🎉 Registered Successfully!');
      navigate('/login');
    } else {
      const errors = response?.errors || [];
      errors.forEach((msg) => {
        toast.error(msg.message);
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 Caprasimo text-cyan-600">
        Mini LinkdIn
        </h2>
        <h3 className="text-xl font-semibold text-center mb-6 Prompt text-gray-800">
          Create Account
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
              ref={name}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 Roboto">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              ref={email}
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
              ref={phone}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1 Roboto">Address</label>
            <textarea
              placeholder="Enter your address"
              ref={address}
              rows="2"
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
            ></textarea>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium mb-1 Roboto">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              ref={picture}
              onChange={handlePicChange}
              className="hidden"
            />
            <label
              htmlFor="profilePic"
              className="inline-block cursor-pointer bg-cyan-500 hover:bg-cyan-600 
                         text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
            >
              Choose File
            </label>
            <p className="mt-2 text-sm text-gray-600 text-center Roboto">
              {fileName || 'No file chosen'}
            </p>
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
            <label className="block text-sm font-medium mb-1 Roboto">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              ref={password}
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
              ref={confirmPassword}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
            />
          </div>

          {/* Show Password Toggle */}
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
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 
                       rounded-lg cursor-pointer font-medium transition transform hover:scale-105 Prompt"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center Roboto">
          Already have an account?{' '}
          <Link to={'/login'} className="text-cyan-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginHandling } from '../../serverLayer';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { appContext } from '../components/appContext';

const Login = () => {
  const { loginStatus, setLoginStatus, logOut } = useContext(appContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const email = useRef(null);
  const password = useRef(null);

  async function formSubmite(e) {
    e.preventDefault();
    const response = await loginHandling(email, password);
    if (response.status == 200) {
      navigate('/');
      toast.success('🎉 Login Successfully!');
      setLoginStatus(true);
      location.reload();
    } else {
      toast.error(response.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
      {!loginStatus ? (
        <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-6 Caprasimo text-cyan-600">
            Mini LinkdIn
          </h2>
          <h3 className="text-xl font-semibold text-center mb-6 Roboto text-gray-800">
            Login Your Account
          </h3>

          {/* Form */}
          <form onSubmit={formSubmite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 Roboto">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                ref={email}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 Roboto">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                ref={password}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 Roboto"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm Roboto">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 text-cyan-600 rounded-full"
              />
              <label htmlFor="showPassword" className="cursor-pointer">
                Show Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-medium transition transform hover:scale-105 Prompt cursor-pointer "
            >
              Login
            </button>
          </form>

          {/* Extra Links */}
          <p className="text-sm text-gray-600 mt-4 text-center Roboto">
            Don’t have an account?{' '}
            <Link to={'/signin'} className="text-cyan-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200 flex flex-col justify-center">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-6 Caprasimo text-cyan-600">
            Task Manager
          </h2>
          <h3 className="text-xl font-semibold text-center mb-6 Roboto text-gray-800">
            Log Out Current Identity
          </h3>

          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-2xl font-medium transition transform hover:scale-105 Prompt cursor-pointer"
            onClick={logOut}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;

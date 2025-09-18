import React, { useEffect, useState, useContext } from 'react';
import { accountDetail } from '../../serverLayer';
import { appContext } from '../components/appContext';
import { useNavigate } from 'react-router-dom';
import { accountDelete } from '../../serverLayer';
import toast from 'react-hot-toast';

const AccountDetail = () => {
  const { user, loginStatus, loading, logOut } = useContext(appContext);
  const [detail, setDetail] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in (after loading state is resolved)
    if (!loading && !loginStatus) {
      navigate('/login');
    }

    const fetchDetails = async () => {
      if (loading || !user) return;
      try {
        const data = await accountDetail(user.id);
        setDetail(data);
      } catch (err) {
        console.error('Failed to load account details:', err);
      }
    };

    fetchDetails();
  }, [user, loginStatus, loading, navigate]);

  const handleDelete = async () => {
    try {
      const result = await accountDelete(user.id, password);

      if (result.status === 200) {
        toast.success('Account successfully deleted!');
        await logOut();
        setShowDialog(false);
        navigate('/login'); // ✅ redirect after delete
      } else {
        setError(result.message || 'Failed to delete account');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const confirmDelete = () => {
    if (!password) {
      setError('Password is required');
      return;
    }
    handleDelete();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-30 z-50">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!loginStatus) {
    return null; // Prevents flashing UI before redirect
  }

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
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        {/* Profile Photo */}
        <div className="flex justify-center">
          <img
            src={detail?.pic.url ? detail.pic.url : 'default-profile.png'}
            alt={detail?.name || 'Profile'}
            className="w-28 h-28 rounded-full border-4 border-cyan-500 shadow-md object-cover"
          />
        </div>

        {/* Name */}
        <h2 className="mt-4 text-2xl Caprasimo text-gray-800">
          {detail?.name || 'Unknown'}
        </h2>

        {/* Email */}
        <p className="mt-2 text-gray-600 text-sm Roboto">
          {detail?.email || 'No email'}
        </p>

        {/* Phone */}
        <div className="mt-4 flex items-center justify-center text-gray-700 Prompt">
          <span className="font-medium">📞</span>
          <span className="ml-2">{detail?.phone || 'No phone'}</span>
        </div>

        {/* Address */}
        <div className="mt-2 flex items-center justify-center text-gray-700 Prompt">
          <span className="font-medium">📍</span>
          <span className="ml-2">{detail?.address || 'No address'}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/update')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg font-medium transition transform hover:scale-105 Prompt cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setShowDialog(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition transform hover:scale-105 Prompt cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Delete
            </h2>
            <p className="mt-2 text-gray-600 text-sm">
              Please enter your password and confirm below. This action cannot
              be undone.
            </p>

            {/* Password Input */}
            <div className="mt-4">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Confirmation Checkbox */}
            <div className="mt-4 flex items-center justify-start text-left">
              <input
                id="confirmDelete"
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
              />
              <label
                htmlFor="confirmDelete"
                className="ml-2 text-sm text-gray-700"
              >
                I understand this action cannot be undone.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={!password || !confirmChecked}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetail;

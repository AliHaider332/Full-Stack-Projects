import React, { useState, useEffect } from 'react';
import { appContext } from './appContext';
import { loginStatusHandling, logoutHandling, getForEditPost } from '../../serverLayer';
import toast from 'react-hot-toast';

const ContextProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(false); 
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [editData, setEditData] = useState(null);

  // Check login status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const data = await loginStatusHandling();
        setUser(data.user || null);
        setLoginStatus(!!data.loggedIn);
      } catch (err) {
        console.error('Error checking status:', err);
        setUser(null);
        setLoginStatus(false);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  // Logout
  async function logOut() {
    const status = await logoutHandling();
    if (status.status === 200) {
      toast.success('🎉 Logged out Successfully!');
      setLoginStatus(false);
      setUser(null);
    } else {
      toast.error('You are not logged in');
    }
  }

  // Fetch post for editing
  async function fetchEditData(id) {
    try {
      const res = await getForEditPost(id);

      if (res.status === 200) {
        setEditData(res.post); // only store the post, not whole response
      } else {
        toast.error(res.message || 'Post not found');
        setEditData(null);
      }
    } catch (err) {
      console.error('Error fetching post for edit:', err);
      toast.error('Something went wrong while fetching post');
      setEditData(null);
    }
  }

  return (
    <appContext.Provider
      value={{
        loginStatus,
        setLoginStatus,
        logOut,
        user,
        loading,
        fetchEditData,
        editData,
        setEditData, // optional: if you want manual reset
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default ContextProvider;

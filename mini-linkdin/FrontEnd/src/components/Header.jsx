import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // icons
import { appContext } from './appContext';
import '../App.css';

const Header = () => {
  const { loginStatus, logOut } = useContext(appContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="flex justify-between items-center bg-slate-900 text-white px-6 py-4 shadow-md relative rounded-b-2xl">
      {/* Logo */}
      <div className="text-xl font-semibold tracking-wide Caprasimo">
      Mini LinkdIn
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 Roboto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'text-cyan-400 font-semibold transition'
              : 'text-gray-300 hover:text-cyan-400 transition'
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/detail"
          className={({ isActive }) =>
            isActive
              ? 'text-cyan-400 font-semibold transition'
              : 'text-gray-300 hover:text-cyan-400 transition'
          }
        >
          My Profile
        </NavLink>

        <NavLink
          to="/my-posts"
          className={({ isActive }) =>
            isActive
              ? 'text-cyan-400 font-semibold transition'
              : 'text-gray-300 hover:text-cyan-400 transition'
          }
        >
          My Posts
        </NavLink>
      </nav>

      {/* Right side buttons (desktop only) */}
      <div className="hidden md:block">
        {!loginStatus ? (
          <Link
            to="/login"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-full font-medium transition transform hover:scale-105 Prompt cursor-pointer"
          >
            Account
          </Link>
        ) : (
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-full font-medium transition transform hover:scale-105 Prompt cursor-pointer"
            onClick={logOut}
          >
            Log Out
          </button>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown */}
      <div
        ref={menuRef}
        className={`absolute top-16 right-6 bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col space-y-4 w-48 transition-all duration-300 transform origin-top md:hidden ${
          menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        }`}
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'text-cyan-400 font-semibold'
              : 'text-gray-300 hover:text-cyan-400'
          }
          onClick={() => setMenuOpen(false)}
        >
          Home
        </NavLink>

        <NavLink
          to="/detail"
          className={({ isActive }) =>
            isActive
              ? 'text-cyan-400 font-semibold'
              : 'text-gray-300 hover:text-cyan-400'
          }
          onClick={() => setMenuOpen(false)}
        >
          My Profile
        </NavLink>

        <NavLink
          to="/my-posts"
          className={({ isActive }) =>
            isActive
              ? 'text-cyan-400 font-semibold'
              : 'text-gray-300 hover:text-cyan-400'
          }
          onClick={() => setMenuOpen(false)}
        >
          My Posts
        </NavLink>

        {!loginStatus ? (
          <Link
            to="/login"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition"
            onClick={() => setMenuOpen(false)}
          >
            Account
          </Link>
        ) : (
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition"
            onClick={() => {
              logOut();
              setMenuOpen(false);
            }}
          >
            Log Out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

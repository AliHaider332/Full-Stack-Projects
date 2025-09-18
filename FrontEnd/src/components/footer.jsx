import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 px-6 py-10 mt-12 rounded-t-2xl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-500 Caprasimo">
            Mini LinkdIn
          </h2>
          <p className="text-sm mt-3 Roboto">
            A simple social platform where you can connect, share posts, and
            engage with others.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 Roboto">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-cyan-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/detail" className="hover:text-cyan-400 transition">
                My Profile
              </Link>
            </li>
            <li>
              <Link to="/my-posts" className="hover:text-cyan-400 transition">
                My Posts
              </Link>
            </li>
            <li>
              <Link
                to="/post-create"
                className="hover:text-cyan-400 transition"
              >
                Create Post
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 Roboto">
            Connect
          </h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-cyan-400 transition">
              Twitter
            </a>
            <a href="#" className="hover:text-cyan-400 transition">
              LinkedIn
            </a>
            <a href="#" className="hover:text-cyan-400 transition">
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Mini LinkdIn. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

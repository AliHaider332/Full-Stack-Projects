import React from "react";
import { useNavigate } from "react-router-dom";

const pageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-screen  text-white overflow-hidden">
    {/* Floating animated blobs */}
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600 opacity-30 rounded-full blur-3xl animate-pulse"></div>

    {/* Main content */}
    <div className="relative z-10 text-center px-6">
      <h1 className="text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-lg">
        404
      </h1>
      <p className="text-2xl sm:text-3xl font-semibold text-gray-200 mb-6">
        Oops! Page not found
      </p>
      <p className="text-gray-400 max-w-lg mx-auto mb-8">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl bg-gray-800/60 hover:bg-gray-700/80 backdrop-blur-lg border border-gray-600 text-gray-200 transition shadow-lg"
        >
          🔙 Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white transition shadow-lg"
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  </div>
  );
};

export default pageNotFound;

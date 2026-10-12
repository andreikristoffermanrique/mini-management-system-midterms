import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand / Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-xl font-bold tracking-wide text-indigo-400 hover:text-indigo-300">
              Mini Management
            </Link>
          </div>

          {/* Navigation Links: Home, Dashboard, Records */}
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-indigo-300 transition">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-indigo-300 transition">
              Dashboard
            </Link>
            <Link to="/records" className="hover:text-indigo-300 transition">
              Records
            </Link>
          </div>

          {/* User Status / Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-xs bg-slate-700 px-3 py-1 rounded-full text-slate-300 border border-slate-600">
                  {user.role ? user.role.toUpperCase() : 'USER'}: {user.username || user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-1.5 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="text-sm px-3 py-1.5 rounded text-slate-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
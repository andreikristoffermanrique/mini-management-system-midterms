import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand Name */}
          <Link to="/" className="text-xl font-extrabold text-indigo-600 tracking-tight hover:text-indigo-500 transition">
            Mini Management
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition">
              Home
            </Link>
            <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition">
              Dashboard
            </Link>
            <Link to="/records" className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition">
              Records
            </Link>

            {/* Auth Actions (Desktop) */}
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              {user ? (
                <>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {user.username || 'User'}
                  </span>
                  <button
                    onClick={handleLogoutClick}
                    className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg shadow-sm transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-md"
              aria-label="Toggle Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-slate-50 px-4 pt-3 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 hover:bg-slate-200/60 px-3 py-2 rounded-md font-medium text-base"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 hover:bg-slate-200/60 px-3 py-2 rounded-md font-medium text-base"
          >
            Dashboard
          </Link>
          <Link
            to="/records"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 hover:bg-slate-200/60 px-3 py-2 rounded-md font-medium text-base"
          >
            Records
          </Link>

          <div className="border-t border-slate-200 pt-3 mt-2">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
                  {user.username || 'User'}
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-medium text-slate-700 bg-white border border-slate-300 py-2 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-medium text-white bg-indigo-600 py-2 rounded-lg shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
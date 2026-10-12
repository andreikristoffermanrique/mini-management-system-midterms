import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200/80 transition-all">
                  <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    Welcome to Mini Management System
                  </h2>
                  <p className="text-slate-600 mt-2 text-base leading-relaxed">
                    Use the navigation bar above to log in, register, or access your system dashboard.
                  </p>
                </div>
              } 
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/records" 
              element={
                <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200/80">
                  <h2 className="text-2xl font-bold text-slate-800">Records Management</h2>
                  <p className="text-slate-600 mt-2">Manage system records and user permissions here.</p>
                </div>
              } 
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
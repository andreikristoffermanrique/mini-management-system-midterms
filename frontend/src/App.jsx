import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

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
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<h2 className="text-2xl font-bold">Home Page</h2>} />
            <Route path="/dashboard" element={<h2 className="text-2xl font-bold">Dashboard</h2>} />
            <Route path="/records" element={<h2 className="text-2xl font-bold">Records Management</h2>} />
            <Route path="/login" element={<h2 className="text-2xl font-bold">Login Page</h2>} />
            <Route path="/register" element={<h2 className="text-2xl font-bold">Register Page</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
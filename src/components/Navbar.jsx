import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('antara_token');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-surface/50 backdrop-blur-md border-b border-border-color sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold gradient-text">Antara AI</Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">Dashboard</Link>
          <button 
            onClick={handleLogout}
            className="text-sm bg-red-500/10 text-red-400 px-4 py-1.5 rounded hover:bg-red-500/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

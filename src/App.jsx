import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/Dashboard';
import JournalPage from './pages/Journal';
import Login from './pages/Login';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('antara_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-background-color text-text-primary font-sans relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-color rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <>
              <Navbar />
              <main className="container mx-auto px-4 py-8 relative z-10">
                <DashboardPage />
              </main>
            </>
          </PrivateRoute>
        } />
        
        <Route path="/dashboard" element={<Navigate to="/" />} />
        
        <Route path="/journal" element={
          <PrivateRoute>
            <>
              <Navbar />
              <main className="container mx-auto px-4 py-8 relative z-10">
                <JournalPage />
              </main>
            </>
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;

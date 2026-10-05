import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AvailableAssignments from './AvailableAssignments';
import MySubmissions from './MySubmissions';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="w-64 bg-student text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">Student Portal</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/student" className="block p-2 rounded hover:bg-purple-800 transition">Dashboard</Link>
          <Link to="/student/assignments" className="block p-2 rounded hover:bg-purple-800 transition">Assignments</Link>
          <Link to="/student/my-submissions" className="block p-2 rounded hover:bg-purple-800 transition">My Submissions</Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <p className="mb-2 text-sm">{user?.name}</p>
          <button onClick={handleLogout} className="w-full btn-primary bg-red-600 hover:bg-red-700">Logout</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
        <Routes>
          <Route path="/" element={<Navigate to="/student/assignments" />} />
          <Route path="/assignments" element={<AvailableAssignments />} />
          <Route path="/my-submissions" element={<MySubmissions />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;

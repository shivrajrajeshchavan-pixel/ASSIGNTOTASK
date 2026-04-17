import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminHome from './AdminHome';
import ManageTeachers from './ManageTeachers';
import ManageStudents from './ManageStudents';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-admin text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">AttendoTask</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="block p-2 rounded hover:bg-gray-800 transition">Dashboard</Link>
          <Link to="/admin/manage-teachers" className="block p-2 rounded hover:bg-gray-800 transition">Manage Teachers</Link>
          <Link to="/admin/manage-students" className="block p-2 rounded hover:bg-gray-800 transition">Manage Students</Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <p className="mb-2 text-sm">{user?.name}</p>
          <button onClick={handleLogout} className="w-full btn-primary bg-red-600 hover:bg-red-700">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/manage-teachers" element={<ManageTeachers />} />
          <Route path="/manage-students" element={<ManageStudents />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;

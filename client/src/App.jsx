import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={
        user ? (
          user.role === 'admin' ? <Navigate to="/admin" /> :
          user.role === 'teacher' ? <Navigate to="/teacher" /> :
          <Navigate to="/student" />
        ) : <Navigate to="/login" />
      } />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      
      {/* Protected Routes */}
      {user && user.role === 'admin' && (
        <Route path="/admin/*" element={<AdminDashboard />} />
      )}
      
      {user && user.role === 'teacher' && (
        <Route path="/teacher/*" element={<TeacherDashboard />} />
      )}
      
      {user && user.role === 'student' && (
        <Route path="/student/*" element={<StudentDashboard />} />
      )}

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

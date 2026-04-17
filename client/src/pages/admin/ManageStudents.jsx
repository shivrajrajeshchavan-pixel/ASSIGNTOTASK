import React, { useState, useEffect } from 'react';
import { getUsers, addUser, removeUser } from '../../api/adminApi';
import { UserPlus, Trash2 } from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '', rollNumber: '', semester: '', section: '' });

  const fetchStudents = async () => {
    try {
      const data = await getUsers('student');
      setStudents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addUser({
        ...formData,
        role: 'student'
      });
      setFormData({ name: '', email: '', password: '', department: '', rollNumber: '', semester: '', section: '' });
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding student');
    }
  };

  const handleRemove = async (id) => {
    if(window.confirm('Remove this student?')) {
      await removeUser(id);
      fetchStudents();
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Manage Students</h2>

      <div className="glass-panel p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center"><UserPlus className="mr-2 text-student" size={20}/> Add New Student</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="input-field md:col-span-1" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="input-field md:col-span-1" type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input className="input-field md:col-span-1" type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <input className="input-field" placeholder="Roll Number" required value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} />
          <input className="input-field" placeholder="Semester (e.g. 4)" type="number" required value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} />
          <input className="input-field" placeholder="Section (e.g. A)" required value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} />
          <input className="input-field md:col-span-3" placeholder="Department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
          <button type="submit" className="btn-primary md:col-span-3 bg-student hover:bg-purple-900 py-3">Add Student</button>
        </form>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Roll No</th>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Sem / Sec</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> :
              students.map(s => (
                <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-gray-800">{s.profile?.rollNumber}</td>
                  <td className="p-4 text-gray-800">{s.name}</td>
                  <td className="p-4 text-gray-600">{s.email}</td>
                  <td className="p-4 text-gray-600">{s.profile?.semester} / {s.profile?.section}</td>
                  <td className="p-4">
                    <button onClick={() => handleRemove(s._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;

import React, { useState, useEffect } from 'react';
import { getUsers, addUser, removeUser } from '../../api/adminApi';
import { UserPlus, Trash2 } from 'lucide-react';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '', designation: '', assignedSubjects: '' });

  const fetchTeachers = async () => {
    try {
      const data = await getUsers('teacher');
      setTeachers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addUser({
        ...formData,
        role: 'teacher',
        assignedSubjects: formData.assignedSubjects.split(',').map(s => s.trim())
      });
      setFormData({ name: '', email: '', password: '', department: '', designation: '', assignedSubjects: '' });
      fetchTeachers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding teacher');
    }
  };

  const handleRemove = async (id) => {
    if(window.confirm('Remove this teacher?')) {
      await removeUser(id);
      fetchTeachers();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800">Manage Teachers</h2>

      <div className="glass-panel p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center"><UserPlus className="mr-2 text-admin" size={20}/> Add New Teacher</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input-field" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="input-field" type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input className="input-field" type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <input className="input-field" placeholder="Department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
          <input className="input-field" placeholder="Designation (e.g. Professor)" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
          <input className="input-field" placeholder="Subjects (comma separated)" value={formData.assignedSubjects} onChange={e => setFormData({...formData, assignedSubjects: e.target.value})} />
          <button type="submit" className="btn-primary md:col-span-2 bg-admin hover:bg-gray-800 py-3">Add Teacher</button>
        </form>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Department</th>
              <th className="p-4 font-semibold text-gray-600">Subjects</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> :
              teachers.map(t => (
                <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-gray-800">{t.name}</td>
                  <td className="p-4 text-gray-600">{t.email}</td>
                  <td className="p-4 text-gray-600">{t.department}</td>
                  <td className="p-4 text-gray-600">{t.profile?.assignedSubjects?.join(', ') || '-'}</td>
                  <td className="p-4">
                    <button onClick={() => handleRemove(t._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition">
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

export default ManageTeachers;

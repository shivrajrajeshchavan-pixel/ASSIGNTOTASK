import React, { useState, useEffect } from 'react';
import { getAssignments, createAssignment } from '../../api/teacherApi';
import { PlusCircle, FileText } from 'lucide-react';

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '', subjectName: '', deadline: '' });
  const [file, setFile] = useState(null);

  const fetchAssignments = async () => {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (file) data.append('file', file);
      
      await createAssignment(data);
      setFormData({ title: '', description: '', subjectName: '', deadline: '' });
      setFile(null);
      document.getElementById('file-upload').value = '';
      fetchAssignments();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating assignment');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800">Assign Tasks (Upload PDF)</h2>
      
      <div className="glass-panel p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center"><PlusCircle className="mr-2 text-teacher" size={20}/> Upload New Task</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input-field" placeholder="Task Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input className="input-field" placeholder="Subject Name (e.g. Data Structures)" required value={formData.subjectName} onChange={e => setFormData({...formData, subjectName: e.target.value})} />
          <textarea className="input-field md:col-span-2 min-h-[100px]" placeholder="Detailed Instructions" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <input className="input-field" type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
          <input id="file-upload" className="input-field cursor-pointer" type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
          <button type="submit" className="btn-primary md:col-span-2 bg-teacher hover:bg-green-900 py-3 mt-2">Publish Task to Students</button>
        </form>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Title</th>
              <th className="p-4 font-semibold text-gray-600">Subject</th>
              <th className="p-4 font-semibold text-gray-600">Deadline</th>
              <th className="p-4 font-semibold text-gray-600">Task PDF</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr> :
              assignments.map(a => (
                <tr key={a._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-gray-800">{a.title}</td>
                  <td className="p-4 text-gray-600">{a.subjectName}</td>
                  <td className="p-4 text-gray-600">{new Date(a.deadline).toLocaleDateString()}</td>
                  <td className="p-4">
                    {a.taskFileUrl ? (
                      <a href={`http://localhost:5000${a.taskFileUrl}`} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                        <FileText size={18} className="mr-1" /> View PDF
                      </a>
                    ) : '-'}
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

export default ManageAssignments;

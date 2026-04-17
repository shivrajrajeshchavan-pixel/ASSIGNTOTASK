import React, { useState, useEffect } from 'react';
import { getMySubmissions } from '../../api/studentApi';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const data = await getMySubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold border border-green-200"><CheckCircle size={16} className="mr-1"/> Completed / Attendance Updated</span>;
      case 'rejected':
        return <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-semibold border border-red-200"><XCircle size={16} className="mr-1"/> Rejected</span>;
      default:
        return <span className="flex items-center text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-sm font-semibold border border-orange-200"><Clock size={16} className="mr-1"/> Pending Review</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800">My Submissions Tracker</h2>
      
      <div className="glass-panel overflow-hidden mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Task Title</th>
              <th className="p-4 font-semibold text-gray-600">Submitted On</th>
              <th className="p-4 font-semibold text-gray-600">My Upload</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> :
              submissions.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-500">You haven't submitted any tasks yet.</td></tr> :
              submissions.map(s => (
                <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-gray-800">{s.assignmentId?.title || 'Deleted Task'}</td>
                  <td className="p-4 text-gray-600">{new Date(s.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                     <a href={`http://localhost:5000${s.fileUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-student hover:text-purple-800 font-medium">
                        <FileText size={16} className="mr-1" /> View PDF
                     </a>
                  </td>
                  <td className="p-4">{getStatusBadge(s.status)}</td>
                  <td className="p-4 text-gray-600 text-sm whitespace-pre-wrap">{s.feedback || '-'}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MySubmissions;

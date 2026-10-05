import React, { useState, useEffect } from 'react';
import { getAssignments, getSubmissionsForAssignment, gradeSubmission } from '../../api/teacherApi';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

const ReviewSubmissions = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  useEffect(() => {
    getAssignments().then(setAssignments).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedAssignment) {
      setLoadingSubs(true);
      getSubmissionsForAssignment(selectedAssignment)
        .then(setSubmissions)
        .catch(console.error)
        .finally(() => setLoadingSubs(false));
    } else {
      setSubmissions([]);
    }
  }, [selectedAssignment]);

  const handleGrade = async (subId, status) => {
    try {
      await gradeSubmission(subId, status, `Marked as ${status}`);
      setSubmissions(submissions.map(s => s._id === subId ? { ...s, status } : s));
    } catch(err) {
      alert("Error grading submission");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Review Submissions</h2>

      <div className="glass-panel p-6 shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Task to Review</label>
        <select 
          className="input-field" 
          value={selectedAssignment} 
          onChange={e => setSelectedAssignment(e.target.value)}
        >
          <option value="">-- Choose an Assignment --</option>
          {assignments.map(a => (
            <option key={a._id} value={a._id}>{a.title} ({a.subjectName})</option>
          ))}
        </select>
      </div>

      {selectedAssignment && (
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Student</th>
                <th className="p-4 font-semibold text-gray-600">Attachment</th>
                <th className="p-4 font-semibold text-gray-600">Submitted At</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Action (Updates Attendance)</th>
              </tr>
            </thead>
            <tbody>
              {loadingSubs ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> :
                submissions.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-500">No submissions yet for this task.</td></tr> :
                submissions.map(s => (
                  <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-gray-800">{s.studentId?.name || 'Unknown Student'}</td>
                    <td className="p-4">
                      {s.fileUrl ? (
                        <a href={`http://localhost:5000${s.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                          <FileText size={18} className="mr-1" /> View PDF
                        </a>
                      ) : 'No File'}
                    </td>
                    <td className="p-4 text-gray-600">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${s.status === 'approved' ? 'bg-green-100 text-green-700' : s.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 flex space-x-2">
                      {s.status === 'pending' && (
                        <>
                          <button onClick={() => handleGrade(s._id, 'approved')} className="text-green-600 hover:text-green-800 p-2 shadow rounded hover:bg-green-50 transition" title="Mark Completed (Updates Attendance)">
                            <CheckCircle size={20} />
                          </button>
                          <button onClick={() => handleGrade(s._id, 'rejected')} className="text-red-600 hover:text-red-800 p-2 shadow rounded hover:bg-red-50 transition" title="Reject">
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissions;

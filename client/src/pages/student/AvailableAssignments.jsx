import React, { useState, useEffect } from 'react';
import { getAvailableAssignments, submitAssignment } from '../../api/studentApi';
import { UploadCloud, FileText } from 'lucide-react';

const AvailableAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);

  const fetchAssignments = async () => {
    try {
      const data = await getAvailableAssignments();
      setAssignments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleUpload = async (e, assignmentId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if PDF
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert("Please upload a strict PDF file as required by the Task Instructions.");
      return;
    }

    try {
      setUploadingId(assignmentId);
      await submitAssignment(assignmentId, file);
      alert('Task submitted successfully! Awaiting teacher review.');
      fetchAssignments(); // refresh to hopefully remove the form if backend handles it or they can re-upload
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting task');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800">Available Tasks</h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? <p>Loading tasks...</p> : assignments.length === 0 ? <p className="text-gray-500">No active tasks right now. You're all caught up!</p> :
          assignments.map(ass => (
            <div key={ass._id} className="glass-panel p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-student">{ass.title}</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-purple-200">
                    {ass.subjectName}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">{ass.description}</p>
                
                <div className="flex flex-col space-y-2 mb-6">
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Teacher:</span> {ass.teacherId?.name || 'Unknown'}
                  </div>
                  <div className="text-sm text-red-500 font-semibold">
                    Deadline: {new Date(ass.deadline).toLocaleDateString()}
                  </div>
                  {ass.taskFileUrl && (
                    <a href={`http://localhost:5000${ass.taskFileUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm mt-2">
                      <FileText size={16} className="mr-1" /> View Task PDF Resources
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-6 -mb-6 p-6 rounded-b-xl border-dashed">
                <label className="block mb-2 text-sm font-medium text-gray-900">Upload Completed PDF</label>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor={`dropzone-${ass._id}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploadingId === ass._id ? (
                                <p className="mb-2 text-sm text-gray-500">Uploading securely...</p>
                            ) : (
                                <>
                                  <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                  <p className="text-xs text-gray-400">PDF ONLY (MAX. 10MB)</p>
                                </>
                            )}
                        </div>
                        <input id={`dropzone-${ass._id}`} type="file" className="hidden" accept=".pdf" onChange={(e) => handleUpload(e, ass._id)} disabled={uploadingId === ass._id} />
                    </label>
                </div> 
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default AvailableAssignments;

import api from './axiosInstance';

export const getAssignments = async () => {
  const response = await api.get('/assignments');
  return response.data;
};

export const createAssignment = async (formData) => {
  const response = await api.post('/assignments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getSubmissionsForAssignment = async (assignmentId) => {
  const response = await api.get(`/submissions/assignment/${assignmentId}`);
  return response.data;
};

export const gradeSubmission = async (submissionId, status, feedback) => {
  const response = await api.put(`/submissions/${submissionId}/review`, { status, teacherRemark: feedback });
  return response.data;
};

// Teacher attendance management
export const getStudentShortages = async () => {
  const response = await api.get('/attendance/shortages'); // Wait, check if exist
  return response.data;
}

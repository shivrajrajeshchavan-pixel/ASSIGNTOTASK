import api from './axiosInstance';

export const getAvailableAssignments = async () => {
  const response = await api.get('/assignments');
  return response.data;
};

export const submitAssignment = async (assignmentId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('assignmentId', assignmentId);

  // Using multipart form data for PDF upload
  const response = await api.post('/submissions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getMySubmissions = async () => {
  const response = await api.get('/submissions/my');
  return response.data;
};

export const getMyAttendance = async () => {
  const response = await api.get('/attendance/me');
  return response.data;
};

import api from './axiosInstance';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
};

export const getUsers = async (role) => {
  const response = await api.get(`/admin/users${role ? `?role=${role}` : ''}`);
  return response.data;
};

export const addUser = async (userData) => {
  const response = await api.post('/admin/add-user', userData);
  return response.data;
};

export const removeUser = async (id) => {
  const response = await api.delete(`/admin/remove-user/${id}`);
  return response.data;
};

import API from './api';

export const getNotifications = (filters) => API.get('/notifications', { params: filters });

export const markAsRead = (id) => API.put(`/notifications/${id}/read`);

export const markAllAsRead = () => API.put('/notifications/read-all');

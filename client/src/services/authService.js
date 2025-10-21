import API from './api';

export const register = (userData) => API.post('/auth/register', userData);

export const login = (credentials) => API.post('/auth/login', credentials);

export const getMe = () => API.get('/auth/me');

export const logout = () => API.post('/auth/logout');

export const enable2FA = () => API.post('/auth/enable-2fa');

export const confirm2FA = (token) => API.post('/auth/confirm-2fa', { token });

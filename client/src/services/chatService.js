import API from './api';

export const getChats = () => API.get('/chat');

export const getChat = (id) => API.get(`/chat/${id}`);

export const createChat = (participantId) => API.post('/chat/create', { participantId });

export const sendMessage = (chatId, message) => API.post(`/chat/${chatId}/message`, message);

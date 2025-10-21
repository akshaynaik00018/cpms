import API from './api';

export const getForumPosts = (filters) => API.get('/forum', { params: filters });

export const getForumPost = (id) => API.get(`/forum/${id}`);

export const createForumPost = (post) => API.post('/forum', post);

export const addReply = (postId, content) => API.post(`/forum/${postId}/reply`, { content });

export const upvotePost = (postId) => API.post(`/forum/${postId}/upvote`);

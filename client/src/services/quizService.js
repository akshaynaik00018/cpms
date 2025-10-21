import API from './api';

export const getQuizzes = (filters) => API.get('/quiz', { params: filters });

export const getQuiz = (id) => API.get(`/quiz/${id}`);

export const startQuizAttempt = (quizId) => API.post(`/quiz/${quizId}/attempt`);

export const submitQuiz = (attemptId, data) => API.post(`/quiz/attempt/${attemptId}/submit`, data);

export const getMyAttempts = () => API.get('/quiz/my-attempts');

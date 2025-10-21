import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';
import notificationReducer from './slices/notificationSlice';
import chatReducer from './slices/chatSlice';
import forumReducer from './slices/forumSlice';
import quizReducer from './slices/quizSlice';
import themeReducer from './slices/themeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    notifications: notificationReducer,
    chat: chatReducer,
    forum: forumReducer,
    quiz: quizReducer,
    theme: themeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;

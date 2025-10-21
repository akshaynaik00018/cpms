import { createSlice } from '@reduxjs/toolkit';

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    quizzes: [],
    currentQuiz: null,
    currentAttempt: null,
    loading: false,
    error: null
  },
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    setCurrentQuiz: (state, action) => {
      state.currentQuiz = action.payload;
    },
    setCurrentAttempt: (state, action) => {
      state.currentAttempt = action.payload;
    }
  }
});

export const { setQuizzes, setCurrentQuiz, setCurrentAttempt } = quizSlice.actions;
export default quizSlice.reducer;

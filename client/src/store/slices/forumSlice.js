import { createSlice } from '@reduxjs/toolkit';

const forumSlice = createSlice({
  name: 'forum',
  initialState: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    addReply: (state, action) => {
      if (state.currentPost) {
        state.currentPost.replies.push(action.payload);
      }
    }
  }
});

export const { setPosts, setCurrentPost, addReply } = forumSlice.actions;
export default forumSlice.reducer;

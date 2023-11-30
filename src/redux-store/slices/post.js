import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getPostsAction: (state, action) => {
      const { payload } = action;
      state.posts = payload;
    },
    addPostToPostsAction: (state, action) => {
      const { payload } = action;
      state.posts = [payload, ...state.posts];
    },
  },
});

export const {
  actions: { getPostsAction, addPostToPostsAction },
} = postSlice;

export default postSlice.reducer;

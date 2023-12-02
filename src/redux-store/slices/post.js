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
    removePostAction: (state, action) => {
      const { payload } = action;

      let tmpPosts = [...state.posts];
      tmpPosts = tmpPosts.filter((post) => post?._id !== payload?._id);

      state.posts = tmpPosts;
    },
    updatePostStatus: (state, action) => {
      const { payload } = action;

      let tmpPosts = [...state.posts];
      tmpPosts = tmpPosts.map((post) =>
        post?._id !== payload?._id ? post : payload
      );

      state.posts = tmpPosts;
    },
  },
});

export const {
  actions: {
    getPostsAction,
    addPostToPostsAction,
    updatePostStatus,
    removePostAction,
  },
} = postSlice;

export default postSlice.reducer;

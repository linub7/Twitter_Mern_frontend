import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  profileData: {},
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPostsAction: (state, action) => {
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
    setProfileData: (state, action) => {
      const { payload } = action;
      state.profileData = payload;
    },
  },
});

export const {
  actions: {
    setPostsAction,
    addPostToPostsAction,
    updatePostStatus,
    removePostAction,
    setProfileData,
  },
} = postSlice;

export default postSlice.reducer;

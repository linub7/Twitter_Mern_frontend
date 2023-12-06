import { createSlice } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';

const initialState = {
  user: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    picturePic: '',
    coverPhoto: '',
    following: [],
    followers: [],
    token: Cookie.get('token') ? JSON.parse(Cookie.get('token')) : null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authenticationAction: (state, action) => {
      const { payload } = action;
      state.user = payload;
    },
    updateFollowingListAction: (state, action) => {
      const {
        payload: { userId, option },
      } = action;

      let tmpFollowing = state.user.following;
      if (option === '$pull') {
        // remove userId from Following
        tmpFollowing = tmpFollowing?.filter((id) => id !== userId);
      } else if (option === '$addToSet') {
        // add userId to Following
        tmpFollowing.push(userId);
      }
      state.user = { ...state.user, following: tmpFollowing };
    },
    logoutAction: (state) => {
      state.user = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        picturePic: '',
        coverPhoto: '',
        token: null,
      };
    },
  },
});

export const {
  actions: { logoutAction, authenticationAction, updateFollowingListAction },
} = userSlice;

export default userSlice.reducer;

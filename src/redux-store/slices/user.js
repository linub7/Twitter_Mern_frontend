import { createSlice } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';

const initialState = {
  user: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    picturePic: '',
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
    logoutAction: (state) => {
      state.user = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        picturePic: '',
        token: null,
      };
    },
  },
});

export const {
  actions: { logoutAction, authenticationAction },
} = userSlice;

export default userSlice.reducer;

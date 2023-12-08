import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groupChatUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleSelectedUsersForGroupChatAction: (state, action) => {
      const { payload } = action;

      const tmpGroupChatUsers = [...state.groupChatUsers];

      const idx = tmpGroupChatUsers.findIndex(
        (user) => user?._id === payload?._id
      );

      if (idx !== -1) {
        state.groupChatUsers = tmpGroupChatUsers?.filter(
          (user) => user?._id !== payload?._id
        );
      } else {
        state.groupChatUsers = [...tmpGroupChatUsers, payload];
      }
    },
    makeEmptySelectedUsersForGroupChatAction: (state, action) => {
      state.groupChatUsers = [];
    },
  },
});

export const {
  actions: {
    makeEmptySelectedUsersForGroupChatAction,
    toggleSelectedUsersForGroupChatAction,
  },
} = chatSlice;

export default chatSlice.reducer;

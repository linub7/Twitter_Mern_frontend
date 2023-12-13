import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newMessageNotificationsCount: 0,
  otherNotificationsCount: 0,
  unreadMessagesCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNewMessageNotificationsCountAction: (state, action) => {
      const { payload } = action;
      state.newMessageNotificationsCount = payload;
    },
    setOtherNotificationsCountAction: (state, action) => {
      const { payload } = action;
      state.otherNotificationsCount = payload;
    },
    setUnreadMessagesCountAction: (state, action) => {
      const { payload } = action;
      state.unreadMessagesCount = payload;
    },
    decrementUnreadMessagesCountAction: (state) => {
      if (state.unreadMessagesCount > 0) {
        state.unreadMessagesCount = state.unreadMessagesCount - 1;
      }
    },
    decrementOtherNotificationsCountAction: (state) => {
      if (state.otherNotificationsCount > 0) {
        state.otherNotificationsCount = state.otherNotificationsCount - 1;
      }
    },
    makeNullOtherNotificationsCountAction: (state) => {
      state.otherNotificationsCount = 0;
    },
  },
});

export const {
  actions: {
    setNewMessageNotificationsCountAction,
    setOtherNotificationsCountAction,
    decrementOtherNotificationsCountAction,
    makeNullOtherNotificationsCountAction,
    setUnreadMessagesCountAction,
    decrementUnreadMessagesCountAction,
  },
} = notificationSlice;

export default notificationSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newMessageNotificationsCount: 0,
  otherNotificationsCount: 0,
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
    decrementOtherNotificationsCountAction: (state) => {
      state.otherNotificationsCount = state.otherNotificationsCount - 1;
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
  },
} = notificationSlice;

export default notificationSlice.reducer;

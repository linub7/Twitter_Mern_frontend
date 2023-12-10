import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  groupChatUsers: [],
  messages: [],
  activeConversation: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversationsAction: (state, action) => {
      const { payload } = action;
      state.conversations = payload;
    },
    updateConversationsAction: (state, action) => {
      const { payload } = action;
      let tmpConversations = [...state.conversations];
      tmpConversations = tmpConversations?.map((conversation) =>
        conversation?._id !== payload?._id ? conversation : payload
      );
      state.conversations = tmpConversations;
    },
    setActiveConversationAction: (state, action) => {
      const { payload } = action;
      state.activeConversation = payload;
    },
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
    makeEmptySelectedUsersForGroupChatAction: (state) => {
      state.groupChatUsers = [];
    },
    makeEmptyConversationsAction: (state) => {
      state.conversations = [];
    },
    makeEmptyActiveConversationAction: (state) => {
      state.activeConversation = {};
    },
    makeEmptyActiveConversationMessagesAction: (state) => {
      state.messages = [];
    },
    setActiveConversationMessagesAction: (state, action) => {
      const { payload } = action;
      state.messages = payload;
    },
    addMessageToActiveConversationAction: (state, action) => {
      const { payload } = action;
      state.messages = [...state.messages, payload];
      const relatedConversation = state.conversations.find(
        (conversation) =>
          conversation?._id?.toString() === payload?.chat?._id?.toString()
      );
      const conversation = {
        ...relatedConversation,
        latestMessage: payload,
      };
      const idx = state.conversations.findIndex(
        (el) => el?._id === conversation._id
      );
      state.conversations.splice(idx, 1);
      state.conversations.unshift(conversation);
    },
  },
});

export const {
  actions: {
    makeEmptySelectedUsersForGroupChatAction,
    toggleSelectedUsersForGroupChatAction,
    setConversationsAction,
    makeEmptyConversationsAction,
    setActiveConversationAction,
    updateConversationsAction,
    addMessageToActiveConversationAction,
    setActiveConversationMessagesAction,
    makeEmptyActiveConversationAction,
    makeEmptyActiveConversationMessagesAction,
  },
} = chatSlice;

export default chatSlice.reducer;

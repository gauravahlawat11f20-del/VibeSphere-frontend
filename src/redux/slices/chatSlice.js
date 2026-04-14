import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: { activeChat: null, messages: [], onlineUsers: [] },
  reducers: {
    setActiveChat: (state, { payload }) => {
      state.activeChat = payload;
      state.messages = [];
    },
    setMessages: (state, { payload }) => { state.messages = payload; },
    addMessage: (state, { payload }) => { state.messages.push(payload); },
    setOnlineUsers: (state, { payload }) => { state.onlineUsers = payload; },
  },
});

export const { setActiveChat, setMessages, addMessage, setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const notifSlice = createSlice({
  name: "notifs",
  initialState: { items: [], unread: 0 },
  reducers: {
    setNotifications(state, { payload }) {
      state.items = payload;
      state.unread = payload.filter((n) => !n.read).length;
    },
    addNotification(state, { payload }) {
      state.items.unshift(payload);
      state.unread += 1;
    },
    clearUnread(state) { state.unread = 0; },
  },
});

export const { setNotifications, addNotification, clearUnread } = notifSlice.actions;
export default notifSlice.reducer;

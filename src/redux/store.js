import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import socketReducer from "./slices/socketSlice";
import notifReducer from "./slices/notifSlice";
import postReducer from "./slices/postSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    socket: socketReducer,
    notifs: notifReducer,
  },
});

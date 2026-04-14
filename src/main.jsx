import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { initApi } from "./utils/axiosInstance";
import { setTokens, logout } from "./redux/slices/authSlice";
import "./index.css";

initApi(store, { setTokens, logout });

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

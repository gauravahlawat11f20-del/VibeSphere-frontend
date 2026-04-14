import axios from "axios";
import { store } from "../redux/store";
import { setTokens, logout } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: "https://vibesphere-backend-plut.onrender.com/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 403 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = store.getState().auth.refreshToken;
        const { data } = await axios.post("https://vibesphere-backend-plut.onrender.com/api/auth/refresh", { refreshToken });
        store.dispatch(setTokens(data));
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        store.dispatch(logout());
      }
    }
    return Promise.reject(err);
  }
);

export default api;

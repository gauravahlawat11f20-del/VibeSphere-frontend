import axios from "axios";
import { getApiBaseUrl, getRefreshUrl } from "./runtimeUrls";

const baseURL = getApiBaseUrl();

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let initialized = false;

export const initApi = (store, { setTokens, logout }) => {
  if (initialized) return;
  initialized = true;

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
          const { data } = await axios.post(getRefreshUrl(), { refreshToken });
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
};

export default api;

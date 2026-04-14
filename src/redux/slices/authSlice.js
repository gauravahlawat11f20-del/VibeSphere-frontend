import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

const stored = JSON.parse(localStorage.getItem("auth") || "null");

export const loginUser = createAsyncThunk("auth/login", async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", creds);
    return data;
  } catch (e) { return rejectWithValue(e.response.data.message); }
});

export const registerUser = createAsyncThunk("auth/register", async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", creds);
    return data;
  } catch (e) { return rejectWithValue(e.response.data.message); }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: stored?.user || null,
    accessToken: stored?.accessToken || null,
    refreshToken: stored?.refreshToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null; state.accessToken = null; state.refreshToken = null;
      localStorage.removeItem("auth");
      api.post("/auth/logout").catch(() => {});
    },
    setTokens(state, { payload }) {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      localStorage.setItem("auth", JSON.stringify({ ...auth, ...payload }));
    },
    updateUser(state, { payload }) {
      state.user = { ...state.user, ...payload };
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      localStorage.setItem("auth", JSON.stringify({ ...auth, user: state.user }));
    },
  },
  extraReducers: (b) => {
    b.addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(loginUser.fulfilled, (s, { payload }) => {
       s.loading = false; s.user = payload.user;
       s.accessToken = payload.accessToken; s.refreshToken = payload.refreshToken;
       localStorage.setItem("auth", JSON.stringify(payload));
     })
     .addCase(loginUser.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })
     .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(registerUser.fulfilled, (s, { payload }) => {
       s.loading = false; s.user = payload.user;
       s.accessToken = payload.accessToken; s.refreshToken = payload.refreshToken;
       localStorage.setItem("auth", JSON.stringify(payload));
     })
     .addCase(registerUser.rejected, (s, { payload }) => { s.loading = false; s.error = payload; });
  },
});

export const { logout, setTokens, updateUser } = authSlice.actions;
export default authSlice.reducer;

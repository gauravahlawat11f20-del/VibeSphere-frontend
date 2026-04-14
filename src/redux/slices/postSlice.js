import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFeed = createAsyncThunk("posts/feed", async (page = 1, { getState }) => {
  const token = getState().auth.accessToken;
  const { data } = await axios.get(`/api/posts/feed?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { posts: data, page };
});

const postSlice = createSlice({
  name: "posts",
  initialState: { feed: [], loading: false, page: 1, hasMore: true },
  reducers: {
    addPost(state, { payload }) { state.feed.unshift(payload); },
    removePost(state, { payload }) { state.feed = state.feed.filter((p) => p._id !== payload); },
    toggleLike(state, { payload: { postId, userId } }) {
      const post = state.feed.find((p) => p._id === postId);
      if (!post) return;
      const idx = post.likes.indexOf(userId);
      if (idx > -1) post.likes.splice(idx, 1);
      else post.likes.push(userId);
    },
    addComment(state, { payload: { postId, comments } }) {
      const post = state.feed.find((p) => p._id === postId);
      if (post) post.comments = comments;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchFeed.pending, (s) => { s.loading = true; })
     .addCase(fetchFeed.fulfilled, (s, { payload }) => {
       s.loading = false;
       if (payload.page === 1) s.feed = payload.posts;
       else s.feed = [...s.feed, ...payload.posts];
       s.hasMore = payload.posts.length === 10;
       s.page = payload.page;
     });
  },
});

export const { addPost, removePost, toggleLike, addComment } = postSlice.actions;
export default postSlice.reducer;

import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../redux/slices/postSlice";
import PostCard from "../components/post/PostCard";
import CreatePost from "../components/post/CreatePost";
import Stories from "../components/story/Stories";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { feed, loading, page, hasMore } = useSelector((s) => s.posts);

  useEffect(() => { dispatch(fetchFeed(1)); }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) dispatch(fetchFeed(page + 1));
  }, [loading, hasMore, page]);

  const lastRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <div className="space-y-6">
      <div className="glow-card p-8 text-center">
        <p className="fancy-subtitle mb-3">Daily pulse</p>
        <h2 className="fancy-heading mb-4">A vibrant feed made to feel electric.</h2>
        <p className="mx-auto max-w-2xl text-sm text-gray-500">
          Every story, post, and reaction has a little shine. Scroll through your community with stylish cards, glowing details, and a premium purple vibe.
        </p>
      </div>
      <Stories />
      <CreatePost />
      {feed.map((post, i) => (
        <div key={post._id} ref={i === feed.length - 1 ? lastRef : null}>
          <PostCard post={post} />
        </div>
      ))}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-soft">
            <div className="spinner" />
            <span className="text-sm text-gray-600 font-medium">Loading more posts...</span>
          </div>
        </div>
      )}
      {!hasMore && feed.length > 0 && (
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 shadow-soft">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-gray-600 font-medium">You're all caught up!</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for new posts</p>
          </div>
        </div>
      )}
      {!loading && feed.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl p-12 shadow-soft max-w-md mx-auto">
            <div className="text-6xl mb-6">📱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to VibeSphere!</h3>
            <p className="text-gray-600 mb-6">Follow some people to see their posts here.</p>
            <button
              onClick={() => navigate('/explore')}
              className="btn-primary"
            >
              Explore Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineDelete, AiOutlineBook } from "react-icons/ai";
import { toggleLike, removePost, addComment } from "../../redux/slices/postSlice";
import { timeAgo } from "../../utils/formatDate";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function PostCard({ post }) {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLiked = post.likes.includes(user._id);
  const isOwner = post.user._id === user._id;

  const handleLike = async () => {
    dispatch(toggleLike({ postId: post._id, userId: user._id }));
    try { await api.put(`/posts/like/${post._id}`); }
    catch { dispatch(toggleLike({ postId: post._id, userId: user._id })); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.put(`/posts/comment/${post._id}`, { text: commentText });
      dispatch(addComment({ postId: post._id, comments: data }));
      setCommentText("");
    } catch { toast.error("Failed to comment"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      dispatch(removePost(post._id));
      toast.success("Post deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const handleBookmark = async () => {
    try {
      const { data } = await api.put(`/posts/bookmark/${post._id}`);
      toast.success(data.bookmarked ? "Saved!" : "Removed from saved");
    } catch { toast.error("Failed to save"); }
  };

  return (
    <div className="card card-hover mb-6 animate-slide-up">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to={`/profile/${post.user.username}`} className="flex items-center gap-3 group">
          <img
            src={post.user.profilePic || `https://ui-avatars.com/api/?name=${post.user.username}&background=random`}
            className="avatar-sm group-hover:ring-primary-300 transition-all duration-200"
            alt={post.user.username}
          />
          <span className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
            {post.user.username}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-danger-500 transition-colors duration-200 p-1 rounded-lg hover:bg-danger-50"
              title="Delete post"
            >
              <AiOutlineDelete size={18} />
            </button>
          )}
        </div>
      </div>

      {post.image && (
        <div className="relative group">
          <img
            src={post.image}
            alt="post"
            className="w-full object-cover max-h-96 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-sm group transition-all duration-200"
            >
              {isLiked ? (
                <AiFillHeart size={24} className="text-danger-500 animate-bounce-soft" />
              ) : (
                <AiOutlineHeart size={24} className="text-gray-600 group-hover:text-danger-500 group-hover:scale-110 transition-all duration-200" />
              )}
              <span className={`font-medium ${isLiked ? 'text-danger-600' : 'text-gray-600'}`}>
                {post.likes.length}
              </span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200 group"
            >
              <AiOutlineComment size={24} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">{post.comments.length}</span>
            </button>
          </div>
          <button
            onClick={handleBookmark}
            className="text-gray-400 hover:text-primary-600 transition-colors duration-200 p-2 rounded-lg hover:bg-primary-50"
            title="Save post"
          >
            <AiOutlineBook size={20} />
          </button>
        </div>

        {post.caption && (
          <div className="mb-4">
            <p className="text-sm text-gray-800 leading-relaxed">
              <Link
                to={`/profile/${post.user.username}`}
                className="font-semibold mr-2 text-gray-900 hover:text-primary-600 transition-colors duration-200"
              >
                {post.user.username}
              </Link>
              {post.caption}
            </p>
          </div>
        )}

        {showComments && (
          <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
            {post.comments.slice(-5).map((c, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <img
                  src={c.user?.profilePic || `https://ui-avatars.com/api/?name=${c.user?.username}&background=random`}
                  className="avatar-sm mt-0.5"
                  alt=""
                />
                <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-2">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold mr-2 text-gray-900">{c.user?.username}</span>
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
            <form onSubmit={handleComment} className="flex gap-3 mt-4">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="input-field flex-1"
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <div className="spinner" /> : 'Post'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

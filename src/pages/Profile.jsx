import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/slices/authSlice";
import { AiOutlineCamera } from "react-icons/ai";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

export default function Profile() {
  const { username } = useParams();
  const { user: me } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const isMe = me?.username === username;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/users/${username}`),
      api.get(`/posts/user/${username}`),
    ])
      .then(([u, p]) => {
        setProfile(u.data);
        setPosts(p.data);
        setFollowing(u.data.followers.some((f) => f._id === me._id));
        setBio(u.data.bio);
      })
      .catch(() => toast.error("User not found"))
      .finally(() => setLoading(false));
  }, [username]);

  const handleFollow = async () => {
    try {
      const { data } = await api.put(`/users/follow/${profile._id}`);
      setFollowing(data.following);
      setProfile((p) => ({
        ...p,
        followers: data.following
          ? [...p.followers, { _id: me._id }]
          : p.followers.filter((f) => f._id !== me._id),
      }));
    } catch { toast.error("Failed"); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.target);
      fd.append("bio", bio);
      const { data } = await api.put("/users/update", fd);
      dispatch(updateUser(data));
      setProfile((p) => ({ ...p, bio: data.bio, profilePic: data.profilePic }));
      setEditing(false);
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="spinner w-8 h-8" />
    </div>
  );

  if (!profile) return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">😔</div>
      <p className="text-gray-500 font-medium">User not found</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="relative">
          {/* Cover gradient */}
          <div className="h-32 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-600 rounded-t-2xl" />
          <div className="px-6 pb-6">
            <div className="flex items-start gap-6 -mt-10">
          <div className="relative">
                <img
                  src={profile.profilePic || `https://ui-avatars.com/api/?name=${profile.username}&background=random&size=120`}
                  className="avatar-lg border-4 border-white shadow-soft"
                  alt={profile.username}
                />
            {isMe && editing && (
                  <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-all duration-200 hover:scale-105 shadow-soft">
                    <AiOutlineCamera size={16} />
                    <input type="file" name="profilePic" accept="image/*" className="hidden" form="edit-form" />
                  </label>
            )}
          </div>
          <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">{profile.username}</h2>
                  {isMe ? (
                    <button
                      onClick={() => setEditing(!editing)}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      {editing ? "Cancel" : "Edit profile"}
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        following
                          ? "btn-secondary"
                          : "btn-primary"
                      }`}
                    >
                      {following ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
                <div className="flex gap-8 text-sm mb-4">
                  <span className="font-semibold text-gray-900">
                    <strong className="text-xl">{posts.length}</strong> posts
                  </span>
                  <span className="font-semibold text-gray-900">
                    <strong className="text-xl">{profile.followers.length}</strong> followers
                  </span>
                  <span className="font-semibold text-gray-900">
                    <strong className="text-xl">{profile.following.length}</strong> following
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {profile.bio || (isMe ? "Add a bio to tell people about yourself!" : "No bio yet.")}
                </p>
          </div>
        </div>

            {isMe && editing && (
              <form id="edit-form" onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-gray-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write something about yourself..."
                      maxLength={150}
                      rows={3}
                      className="input-field resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{bio.length}/150</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary px-6 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <div className="flex items-center gap-2">
                          <div className="spinner" />
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <div
            key={post._id}
            className="aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-soft hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            {post.image ? (
              <img
                src={post.image}
                alt="post"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 p-4 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                {post.caption?.slice(0, 60) || "Text post"}
              </div>
            )}
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl p-12 shadow-soft max-w-md mx-auto">
            <div className="text-6xl mb-6">📷</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">
              {isMe ? "Share your first post to get started!" : "This user hasn't posted anything yet."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

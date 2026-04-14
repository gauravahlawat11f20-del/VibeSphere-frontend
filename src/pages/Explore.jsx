import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import api from "../utils/axiosInstance";
import { useSelector } from "react-redux";

export default function Explore() {
  const { user: me } = useSelector((s) => s.auth);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [following, setFollowing] = useState({});
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    api.get("/users/suggested").then(({ data }) => setSuggested(data));
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get(`/users/search?q=${query}`);
        setResults(data);
      } finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const handleFollow = async (userId) => {
    try {
      const { data } = await api.put(`/users/follow/${userId}`);
      setFollowing((f) => ({ ...f, [userId]: data.following }));
    } catch {}
  };

  const displayList = query.trim() ? results : suggested;

  return (
    <div className="py-4">
      <div className="relative mb-6">
        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        {query ? "Search results" : "Suggested for you"}
      </h2>

      {searching && (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {!searching && displayList.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">
            {query ? "No users found" : "No suggestions available"}
          </p>
        )}
        {displayList.map((u) => (
          <div key={u._id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
            <Link to={`/profile/${u.username}`} className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={u.profilePic || `https://ui-avatars.com/api/?name=${u.username}&background=random`}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                alt={u.username}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{u.username}</p>
                {u.bio && <p className="text-xs text-gray-400 truncate">{u.bio}</p>}
              </div>
            </Link>
            {u._id !== me._id && (
              <button
                onClick={() => handleFollow(u._id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${
                  following[u._id]
                    ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
              >
                {following[u._id] ? "Following" : "Follow"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

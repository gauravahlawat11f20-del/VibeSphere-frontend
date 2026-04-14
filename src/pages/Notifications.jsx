import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications, clearUnread } from "../redux/slices/notifSlice";
import api from "../utils/axiosInstance";
import { timeAgo } from "../utils/formatDate";

const typeLabel = { like: "liked your post", comment: "commented on your post", follow: "started following you" };

export default function Notifications() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.notifs);

  useEffect(() => {
    api.get("/notifications").then(({ data }) => {
      dispatch(setNotifications(data));
      api.put("/notifications/read");
      dispatch(clearUnread());
    });
  }, []);

  return (
    <div className="py-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {items.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">No notifications yet</p>
        )}
        {items.map((n) => (
          <div
            key={n._id}
            className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${
              !n.read ? "bg-blue-50/40" : ""
            }`}
          >
            <Link to={`/profile/${n.sender?.username}`}>
              <img
                src={n.sender?.profilePic || `https://ui-avatars.com/api/?name=${n.sender?.username}&background=random`}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                alt={n.sender?.username}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">
                <Link to={`/profile/${n.sender?.username}`} className="font-semibold hover:underline">
                  {n.sender?.username}
                </Link>{" "}
                {typeLabel[n.type]}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
            </div>
            {n.post?.image && (
              <img src={n.post.image} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" alt="post" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

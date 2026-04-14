import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatWindow from "../components/chat/ChatWindow";
import api from "../utils/axiosInstance";

export default function Messages() {
  const { userId } = useParams();
  const { onlineUsers } = useSelector((s) => s.socket);
  const [chats, setChats] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/messages/chats").then(({ data }) => setChats(data));
  }, []);

  useEffect(() => {
    if (userId) {
      api.get(`/users/${userId}`).then(({ data }) => setActiveUser(data)).catch(() => {});
    }
  }, [userId]);

  const openChat = (user) => {
    setActiveUser(user);
    navigate(`/messages/${user._id}`);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="w-72 border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">No conversations yet</p>
          )}
          {chats.map(({ user, lastMessage }) => (
            <button
              key={user._id}
              onClick={() => openChat(user)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                activeUser?._id === user._id ? "bg-gray-50" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={user.username}
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-400 truncate">{lastMessage?.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {activeUser ? (
          <ChatWindow chatUser={activeUser} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

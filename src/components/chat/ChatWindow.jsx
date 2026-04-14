import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineSend } from "react-icons/ai";
import { getSocket } from "../../hooks/useSocket";
import api from "../../utils/axiosInstance";
import { timeAgo } from "../../utils/formatDate";

export default function ChatWindow({ chatUser }) {
  const { user } = useSelector((s) => s.auth);
  const { onlineUsers } = useSelector((s) => s.socket);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();

  const isOnline = onlineUsers.includes(chatUser._id);

  useEffect(() => {
    api.get(`/messages/${chatUser._id}`).then(({ data }) => setMessages(data));
    const socket = getSocket();
    if (socket) {
      socket.on("newMessage", (msg) => {
        if (msg.sender === chatUser._id || msg.receiver === chatUser._id) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    }
    return () => { getSocket()?.off("newMessage"); };
  }, [chatUser._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const { data } = await api.post(`/messages/${chatUser._id}`, { text });
      setMessages((prev) => [...prev, data]);
      setText("");
    } catch {}
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
        <div className="relative">
          <img
            src={chatUser.profilePic || `https://ui-avatars.com/api/?name=${chatUser.username}&background=random`}
            className="w-9 h-9 rounded-full object-cover"
            alt={chatUser.username}
          />
          {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{chatUser.username}</p>
          <p className="text-xs text-gray-400">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender === user._id;
          return (
            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                isMe ? "bg-gray-900 text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"
              }`}>
                <p>{msg.text}</p>
                <p className={`text-xs mt-0.5 ${isMe ? "text-gray-400" : "text-gray-400"}`}>
                  {timeAgo(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
          className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-40"
        >
          <AiOutlineSend size={16} />
        </button>
      </form>
    </div>
  );
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setOnlineUsers } from "../redux/slices/socketSlice";
import { addNotification } from "../redux/slices/notifSlice";

let socket = null;

export const useSocketSetup = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;
    const apiBase = import.meta.env.VITE_API_BASE_URL || "/api";
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      apiBase.replace(/\/api\/?$/, "") ||
      window.location.origin;

    socket = io(socketUrl, {
      query: { userId: user._id },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socket.on("onlineUsers", (users) => dispatch(setOnlineUsers(users)));
    socket.on("notification", (notif) => dispatch(addNotification(notif)));
    return () => { socket?.disconnect(); socket = null; };
  }, [user]);
};

export const getSocket = () => socket;

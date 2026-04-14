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
    socket = io("https://vibesphere-backend-plut.onrender.com", { query: { userId: user._id } });
    socket.on("onlineUsers", (users) => dispatch(setOnlineUsers(users)));
    socket.on("notification", (notif) => dispatch(addNotification(notif)));
    return () => { socket?.disconnect(); socket = null; };
  }, [user]);
};

export const getSocket = () => socket;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useSocketSetup } from "./hooks/useSocket";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Explore from "./pages/Explore";
import Layout from "./components/layout/Layout";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const { user } = useSelector((s) => s.auth);
  useSocketSetup();
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:userId" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/explore" element={<Explore />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

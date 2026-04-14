import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AiFillHome, AiOutlineCompass, AiOutlineBell,
  AiOutlineMessage, AiOutlineUser, AiOutlineLogout,
} from "react-icons/ai";
import { logout } from "../../redux/slices/authSlice";

export default function Sidebar() {
  const { user } = useSelector((s) => s.auth);
  const { unread } = useSelector((s) => s.notifs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = [
    { to: "/", icon: <AiFillHome size={24} />, label: "Home" },
    { to: "/explore", icon: <AiOutlineCompass size={24} />, label: "Explore" },
    { to: "/notifications", icon: <AiOutlineBell size={24} />, label: "Notifications", badge: unread },
    { to: "/messages", icon: <AiOutlineMessage size={24} />, label: "Messages" },
    { to: `/profile/${user?.username}`, icon: <AiOutlineUser size={24} />, label: "Profile" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 lg:w-72 bg-gradient-to-b from-white/95 via-purple-50 to-pink-50 backdrop-blur-xl border-r border-white/50 shadow-large z-10">
      <div className="flex flex-col h-full p-6">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-700 via-accent-600 to-pink-600 drop-shadow-[0_10px_30px_rgba(236,72,153,0.25)]">
            VibeSphere
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map(({ to, icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 shadow-soft border border-primary-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-soft"
                }`
              }
            >
              <span className="relative">
                <div className="transition-transform duration-200 group-hover:scale-110">
                  {icon}
                </div>
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-danger-500 to-danger-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-soft animate-bounce-soft">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>
              <span className="transition-all duration-200">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <img
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
              className="avatar"
              alt="avatar"
            />
            <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{user?.username}</span>
            <button
              onClick={() => { dispatch(logout()); navigate("/login"); }}
              className="text-gray-400 hover:text-danger-500 transition-colors duration-200 p-1 rounded-lg hover:bg-danger-50"
              title="Logout"
            >
              <AiOutlineLogout size={20} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-4 lg:p-8 max-w-4xl xl:max-w-5xl mx-auto w-full animate-fade-in">
        <div className="space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <Sidebar />
      <main className="flex-1 py-8 px-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

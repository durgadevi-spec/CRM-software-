import { type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, LogOut } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shrink-0">
        <div className="p-6">
          <h1 className="text-white text-2xl font-bold tracking-tight">CRM<span className="text-indigo-500"></span></h1>
          <p className="text-xs text-slate-500 mt-1">Project Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Projects
          </Link>
          <Link to="/create" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors">
            <PlusCircle className="w-4 h-4" />
            Create Project
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

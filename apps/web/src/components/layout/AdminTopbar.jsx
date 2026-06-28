import { useLocation } from "react-router-dom";

const AdminTopbar = () => {
  const location = useLocation();
  
  const getTitle = () => {
    if (location.pathname === "/admin") return "Dashboard";
    if (location.pathname === "/admin/colleges") return "Top College";
    if (location.pathname.startsWith("/admin/colleges/new")) return "Add Top College";
    if (location.pathname.includes("/colleges/edit") || (location.pathname.startsWith("/admin/colleges/") && location.pathname !== "/admin/colleges")) return "Edit Top College";
    if (location.pathname.startsWith("/admin/courses")) return "Course Master";
    if (location.pathname.startsWith("/admin/apis")) return "Manage API Filter";
    if (location.pathname === "/admin/leads") return "All Enquiries";
    if (location.pathname === "/admin/leads/home") return "Home Page Enquiries";
    if (location.pathname === "/admin/leads/college") return "College Page Enquiries";
    if (location.pathname === "/admin/leads/contact") return "Contact Page Enquiries";
    if (location.pathname === "/admin/leads/predictor") return "College Predictor Enquiries";
    return "Dashboard";
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
    }
  };

  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white sticky top-0 z-20">
      {/* Left side: Menu toggle + Title */}
      <div className="flex items-center gap-4">
        <button className="text-slate-500 hover:text-slate-700 md:hidden">
          <span className="text-xl">☰</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-light text-xl select-none hidden md:inline">☰</span>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">{getTitle()}</h1>
        </div>
      </div>

      {/* Right side: Action icons */}
      <div className="flex items-center gap-5 text-ochre">
        {/* Fullscreen icon */}
        <button className="hover:scale-110 transition-transform active:scale-95" title="Toggle Fullscreen">
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
            <path d="M4 4h6v2H6v4H4V4zm14 0h-6v2h4v4h2V4zM4 20h6v-2H6v-4H4v6zm14 0h-6v-2h4v-4h2v6z" />
          </svg>
        </button>

        {/* Power off / Logout button */}
        <button 
          onClick={handleSignOut}
          className="hover:scale-110 transition-transform active:scale-95 text-ochre" 
          title="Sign Out"
        >
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({
    enquiries: false,
    advMaster: false,
    courseMaster: false,
    ranking: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? "bg-[#c58237] text-white shadow-md"
        : "text-slate-700 hover:bg-slate-200/60 hover:text-[#c58237]"
    }`;

  return (
    <aside className="w-64 bg-[#f1f4f9] border-r border-slate-200 min-h-screen flex flex-col justify-between shrink-0 font-sans">
      <div className="p-4 space-y-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#08162d] flex items-center justify-center text-[#c58237] font-black text-xl shadow-md">
            C
          </div>
          <div>
            <div className="text-sm font-black text-[#08162d] leading-none">College Dakhla</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Admin Portal
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
          {/* Dashboard */}
          <NavLink to="/admin/dashboard" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">📊</span>
              <span>Dashboard</span>
            </div>
          </NavLink>

          {/* Enquiries Dropdown */}
          <div>
            <button
              onClick={() => toggleMenu("enquiries")}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200/60 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">✉️</span>
                <span>Enquiries</span>
              </div>
              <span className="text-[10px]">{openMenus.enquiries ? "▲" : "▼"}</span>
            </button>
            {openMenus.enquiries && (
              <div className="ml-7 my-1 space-y-1 border-l-2 border-[#c58237]/40 pl-3">
                <NavLink to="/admin/leads/home" className={({isActive}) => `block py-1.5 text-[11px] font-bold transition-colors ${isActive ? 'text-[#c58237]' : 'text-slate-600 hover:text-[#c58237]'}`}>
                  • Home Enquiries
                </NavLink>
                <NavLink to="/admin/leads/college" className={({isActive}) => `block py-1.5 text-[11px] font-bold transition-colors ${isActive ? 'text-[#c58237]' : 'text-slate-600 hover:text-[#c58237]'}`}>
                  • College Enquiries
                </NavLink>
                <NavLink to="/admin/leads/contact" className={({isActive}) => `block py-1.5 text-[11px] font-bold transition-colors ${isActive ? 'text-[#c58237]' : 'text-slate-600 hover:text-[#c58237]'}`}>
                  • Contact Enquiries
                </NavLink>
                <NavLink to="/admin/leads/predictor" className={({isActive}) => `block py-1.5 text-[11px] font-bold transition-colors ${isActive ? 'text-[#c58237]' : 'text-slate-600 hover:text-[#c58237]'}`}>
                  • Predictor Enquiries
                </NavLink>
                <NavLink to="/admin/leads" className={({isActive}) => `block py-1.5 text-[11px] font-bold transition-colors ${isActive ? 'text-[#c58237]' : 'text-slate-600 hover:text-[#c58237]'}`}>
                  • All Enquiries
                </NavLink>
              </div>
            )}
          </div>

          {/* Course Master Dropdown */}
          <div>
            <button
              onClick={() => toggleMenu("courseMaster")}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200/60 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🎓</span>
                <span>Course Master</span>
              </div>
              <span className="text-[10px]">{openMenus.courseMaster ? "▲" : "▼"}</span>
            </button>
            {openMenus.courseMaster && (
              <div className="ml-7 my-1 space-y-1 border-l-2 border-[#c58237]/40 pl-3">
                <NavLink to="/admin/streams" className="block py-1.5 text-[11px] font-bold text-slate-600 hover:text-[#c58237]">
                  • Streams
                </NavLink>
                <NavLink to="/admin/substreams" className="block py-1.5 text-[11px] font-bold text-slate-600 hover:text-[#c58237]">
                  • Substreams
                </NavLink>
                <NavLink to="/admin/course-durations" className="block py-1.5 text-[11px] font-bold text-slate-600 hover:text-[#c58237]">
                  • Course Duration
                </NavLink>
              </div>
            )}
          </div>

          {/* Entrance Exam */}
          <NavLink to="/admin/exams" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">📋</span>
              <span>Entrance Exam</span>
            </div>
          </NavLink>

          {/* Add Courses */}
          <NavLink to="/admin/courses" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">➕</span>
              <span>Add Courses</span>
            </div>
          </NavLink>

          {/* Add College */}
          <NavLink to="/admin/colleges" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">🏛️</span>
              <span>Add College</span>
            </div>
          </NavLink>

          {/* Add Blogs */}
          <NavLink to="/admin/blogs" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">✍️</span>
              <span>Add Blogs</span>
            </div>
          </NavLink>

          {/* Admission Alerts */}
          <NavLink to="/admin/alerts" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">🔔</span>
              <span>Admission Alerts</span>
            </div>
          </NavLink>

          {/* Reviews & Feedback */}
          <NavLink to="/admin/reviews" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">⭐</span>
              <span>Campus Reviews</span>
            </div>
          </NavLink>

          {/* Q&A Community */}
          <NavLink to="/admin/questions" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">❓</span>
              <span>Q&amp;A Community</span>
            </div>
          </NavLink>

          {/* Testimonials */}
          <NavLink to="/admin/testimonials" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">💬</span>
              <span>Testimonials</span>
            </div>
          </NavLink>

          {/* Scholarships */}
          <NavLink to="/admin/scholarships" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">📜</span>
              <span>Scholarships</span>
            </div>
          </NavLink>

          {/* Study Materials */}
          <NavLink to="/admin/study-material" className={navItemClass}>
            <div className="flex items-center gap-3">
              <span className="text-base">📚</span>
              <span>Study Materials</span>
            </div>
          </NavLink>
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold transition-all border border-rose-200"
        >
          <span>🚪</span>
          <span>Logout System</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

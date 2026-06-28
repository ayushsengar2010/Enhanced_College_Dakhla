import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAlerts } from "../lib/api";
import SmartLeadRecommendationSystem from "../components/SmartLeadRecommendationSystem";

/* ── Developer SVG Icons ────────────────────────────────────────────── */
const ChevronDown = () => (
  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const BellIcon = () => (
  <svg className="w-5 h-5 text-[#08162d] group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const ChevronRight = () => (
  <svg className="w-3.5 h-3.5 text-sky-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const CheckCircle = () => (
  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

/* SVG Module Icons for Mega Menu */
const AcademicIcon = () => (
  <svg className="w-4 h-4 text-[#e28a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);
const BuildingIcon = () => (
  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-9a2 2 0 012-2h2a2 2 0 012 2v9m-4 0h4" />
  </svg>
);
const ReviewIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);
const TargetIcon = () => (
  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const RobotIcon = () => (
  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="8.5" cy="15.5" r="1.5" />
    <circle cx="15.5" cy="15.5" r="1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v4m-4-7h8" />
  </svg>
);
const ScaleIcon = () => (
  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l9-4 9 4M3 6v10a2 2 0 002 2h14a2 2 0 002-2V6M3 6l9 6 9-6" />
  </svg>
);
const ScrollIcon = () => (
  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const TrendingIcon = () => (
  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-4 h-4 text-[#e28a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const NewsIcon = () => (
  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m-6 4h6" />
  </svg>
);
const QuestionIcon = () => (
  <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
  </svg>
);
const BookIcon = () => (
  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

/* Mega Menu Modules */
const col1Modules = [
  { label: "Top Universities & Colleges", to: "/colleges", icon: <BuildingIcon /> },
  { label: "Top Courses", to: "/courses", icon: <AcademicIcon /> },
  { label: "Read College Reviews", to: "/reviews", icon: <ReviewIcon /> },
  { label: "Admission Alerts 2026", to: "/alerts", icon: <BellIcon /> },
  { label: "Guided Discovery", to: "/discover", icon: <TargetIcon /> },
  { label: "College Predictor", to: "/predictor", icon: <RobotIcon /> },
  { label: "Compare Colleges", to: "/compare", icon: <ScaleIcon /> },
  { label: "Scholarships", to: "/scholarships", icon: <ScrollIcon /> },
];

const col2Modules = [
  { label: "ROI Calculator", to: "/roi-calculator", icon: <TrendingIcon /> },
  { label: "Entrance Exams", to: "/exams", icon: <CalendarIcon /> },
  { label: "Education News & Blogs", to: "/blogs", icon: <NewsIcon /> },
  { label: "Ask a Question", to: "/community", icon: <QuestionIcon /> },
  { label: "Study Material & Syllabi", to: "/study-material", icon: <BookIcon /> },
];

/* Main Navigation Bar Links in required sequence */
const navLinks = [
  { label: "Home", to: "/" },
  { label: "Colleges", to: "/colleges" },
  { label: "Courses", to: "/courses" },
  { label: "Blogs", to: "/blogs" },
];

/* Collegedunia Exact Study Preference Categories */
const courseCategories = [
  {
    category: "Engineering",
    icon: "👷‍♂️",
    courses: ["BE/B.Tech", "Diploma in Engineering", "ME/M.Tech", "B.Sc Engineering"]
  },
  {
    category: "Management",
    icon: "📈",
    courses: ["MBA/PGDM", "BBA/BMS", "Executive MBA", "M.Com"]
  },
  {
    category: "Commerce",
    icon: "🛒",
    courses: ["B.Com", "M.Com", "CA / CS", "B.Com (Hons)"]
  },
  {
    category: "Medical",
    icon: "🩺",
    courses: ["MBBS", "BDS", "BAMS", "BHMS", "MD / MS"]
  },
  {
    category: "Arts & Humanities",
    icon: "🎨",
    courses: ["BA", "MA", "BFA", "Journalism (BJMC)"]
  },
  {
    category: "Law",
    icon: "⚖️",
    courses: ["BA LLB", "LLB", "LLM", "BBA LLB"]
  },
  {
    category: "Pharmacy",
    icon: "💊",
    courses: ["B.Pharm", "D.Pharm", "M.Pharm", "Pharma.D"]
  }
];

/* Collegedunia Separate States and Cities Lists */
const popularStates = [
  { name: "All India" },
  { name: "Uttar Pradesh" },
  { name: "Maharashtra" },
  { name: "Karnataka" },
  { name: "Delhi NCR" },
  { name: "Tamil Nadu" },
  { name: "Gujarat" },
  { name: "Rajasthan" },
  { name: "West Bengal" },
  { name: "Madhya Pradesh" },
  { name: "Punjab" },
  { name: "Haryana" }
];

const popularCities = [
  { name: "Mathura" },
  { name: "Noida" },
  { name: "Lucknow" },
  { name: "Greater Noida" },
  { name: "Kanpur" },
  { name: "Agra" },
  { name: "Bangalore" },
  { name: "Mumbai" },
  { name: "Pune" },
  { name: "Hyderabad" },
  { name: "Chennai" },
  { name: "Jaipur" }
];

const PublicRoutes = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [recModalOpen, setRecModalOpen] = useState(false);

  const [modalStep, setModalStep] = useState(1); // 1: Select Course, 2: Select State/City
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("BE/B.Tech");
  const [selectedCity, setSelectedCity] = useState("All India");

  const exploreRef = useRef(null);
  const alertsRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: alertsRes } = useQuery({
    queryKey: ["header-alerts"],
    queryFn: () => getAlerts({ limit: 5 }),
    staleTime: 60000,
  });

  const alertsList = alertsRes?.items || [];

  useEffect(() => {
    const handler = (e) => {
      if (!exploreRef.current?.contains(e.target)) setExploreOpen(false);
      if (!alertsRef.current?.contains(e.target)) setAlertsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setExploreOpen(false);
    setAlertsOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleSelectCourse = (course) => {
    setSelectedGoal(course);
    setSearchQuery("");
    setModalStep(2); // Automatically move to Step 2: Location selection
  };

  const handleSelectLocation = (loc) => {
    setSelectedCity(loc);
    setGoalModalOpen(false);
    setModalStep(1);
    setSearchQuery("");
    navigate(`/colleges?course=${encodeURIComponent(selectedGoal)}&city=${encodeURIComponent(loc === "All India" ? "" : loc)}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">

      {/* ── Ultra-Professional Sticky Header Bar ────────────────────────────── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-sm transition-all duration-300">
        <div className="w-full px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* 1. PROPER LEFT SIDE: Name, Logo + Divider Line + Collegedunia Goal & City Button */}
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md group-hover:scale-105 transition-transform"
                style={{ backgroundColor: "#08162d" }}>
                C
              </div>
              <div className="leading-tight">
                <span className="text-base font-black text-[#08162d] tracking-tight block group-hover:text-[#e28a00] transition-colors">
                  College Dakhla
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest block text-[#e28a00]">
                  ADMISSION PLATFORM
                </span>
              </div>
            </Link>

            {/* Vertical Divider Line */}
            <div className="h-8 w-px bg-slate-300 hidden md:block" />

            {/* Collegedunia Exact Header Trigger Button */}
            <button
              onClick={() => { setModalStep(1); setSearchQuery(""); setGoalModalOpen(true); }}
              className="group hidden md:flex flex-col justify-center text-left hover:opacity-90 transition-all cursor-pointer"
              title="Click to change your goal or city"
            >
              <span className="text-[11px] font-bold text-[#e28a00] flex items-center gap-1 leading-none">
                🎓 Select Goal &amp; 📍 City
              </span>
              <span className="text-xs font-black text-[#08162d] flex items-center gap-1 mt-1 leading-none group-hover:text-[#e28a00] transition-colors">
                {selectedGoal} <ChevronDown />
              </span>
            </button>
          </div>

          {/* 2. PROPER CENTER SIDE: Home, Colleges, Courses, Blogs strictly */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
            {/* Main Nav Links */}
            <nav className="flex items-center gap-7 text-xs font-bold shrink-0">
              {navLinks.map((l) => (
                <Link key={l.label} to={l.to}
                  className={`transition-all relative py-1 hover:text-[#e28a00] ${isActive(l.to) ? "text-[#e28a00] font-black" : "text-slate-600"}`}>
                  {l.label}
                  {isActive(l.to) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e28a00] rounded-full shadow-xs" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* 3. PROPER RIGHT SIDE: Explore More + Admission Alerts Bell + Write a Review + User Profile */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Explore Mega Menu Dropdown placed on the Right Side */}
            <div ref={exploreRef} className="relative">
              <button
                onClick={() => setExploreOpen((o) => !o)}
                className="group flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold border-2 transition-all cursor-pointer bg-[#08162d] border-[#08162d] text-white hover:bg-[#e28a00] hover:border-[#e28a00] hover:shadow-lg active:scale-95"
              >
                <span>Explore More</span>
                <ChevronDown />
              </button>

              {exploreOpen && (
                <div className="absolute right-0 top-full mt-3 w-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-50 grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#08162d] mb-3 pb-2 border-b-2 border-[#e28a00]/30 flex items-center gap-1.5">
                      <span className="text-base">🏫</span> Colleges &amp; Admissions
                    </h4>
                    <div className="space-y-1">
                      {col1Modules.map((m) => (
                        <Link key={m.label} to={m.to} onClick={() => setExploreOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-[#e28a00] hover:shadow-2xs transition-all border border-transparent hover:border-amber-200/50">
                          <span className="shrink-0 p-1.5 rounded-lg bg-slate-100 border border-slate-200 shadow-2xs">{m.icon}</span>
                          <span>{m.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#08162d] mb-3 pb-2 border-b-2 border-[#e28a00]/30 flex items-center gap-1.5">
                      <span className="text-base">🚀</span> Tools &amp; Resources
                    </h4>
                    <div className="space-y-1">
                      {col2Modules.map((m) => (
                        <Link key={m.label} to={m.to} onClick={() => setExploreOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-[#e28a00] hover:shadow-2xs transition-all border border-transparent hover:border-amber-200/50">
                          <span className="shrink-0 p-1.5 rounded-lg bg-slate-100 border border-slate-200 shadow-2xs">{m.icon}</span>
                          <span>{m.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Admission Alerts (BELL ICON ONLY) */}
            <div ref={alertsRef} className="relative">
              <button
                onClick={() => setAlertsOpen((o) => !o)}
                className="group relative p-2.5 rounded-full bg-slate-100 hover:bg-amber-100/80 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-center"
                title="Admission Alerts 2026"
              >
                <BellIcon />
                {alertsList.length > 0 && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute top-0 right-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-0 right-0 border-2 border-white" />
                  </>
                )}
              </button>

              {/* Live Notification Dropdown Popup */}
              {alertsOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 p-4 z-50 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-black text-[#08162d] flex items-center gap-2">
                      <span>🔔</span> Live Admission Alerts ({alertsList.length})
                    </h4>
                    <Link to="/alerts" onClick={() => setAlertsOpen(false)} className="text-[11px] font-extrabold text-[#e28a00] hover:underline">
                      View All &rarr;
                    </Link>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {alertsList.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No active alerts posted.</p>
                    ) : (
                      alertsList.map((a) => (
                        <div key={a._id} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-amber-300 hover:bg-amber-50/30 transition-all space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-[#e28a00]">{a.type || "Alert"}</span>
                            {a.deadline && <span className="text-[10px] font-bold text-rose-500">Till: {new Date(a.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>}
                          </div>
                          <p className="text-xs font-black text-[#08162d] leading-snug">{a.title}</p>
                          {a.body && <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{a.body}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* High Converting "Write a Review" Button */}
            <Link to="/reviews" className="flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-full text-white transition-all shadow-md hover:shadow-lg hover:scale-105 shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95">
              <ReviewIcon /> Write a Review
            </Link>
            
            {/* Interactive User Name & Profile Portal Badge */}
            <Link to="/admin/login" className="group flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 hover:bg-[#08162d] transition-all duration-300 border border-slate-200/80 shadow-2xs" title="User / Admin Portal">
              <div className="w-8 h-8 rounded-full bg-[#08162d] text-white group-hover:bg-amber-500 flex items-center justify-center transition-colors shrink-0 font-bold text-xs">
                <UserIcon />
              </div>
              <div className="text-left leading-none hidden xl:block">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-400 block transition-colors">Welcome</span>
                <span className="text-xs font-black text-[#08162d] group-hover:text-white block transition-colors">Student / Admin</span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button onClick={() => setMobileOpen((o) => !o)} className="lg:hidden p-2 text-slate-700 hover:text-[#08162d] transition-colors">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-fadeIn">
            <button onClick={() => { setMobileOpen(false); setGoalModalOpen(true); }} className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 font-bold text-xs text-[#08162d]">
              <span>🎓 Goal: {selectedGoal} ({selectedCity})</span>
              <span className="text-amber-600">Change &rarr;</span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2 border-t border-slate-100">
              {navLinks.map((l) => (
                <Link key={l.label} to={l.to} onClick={() => setMobileOpen(false)} className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-amber-100 hover:text-[#e28a00]">
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link to="/reviews" onClick={() => setMobileOpen(false)} className="w-full block text-center py-2.5 rounded-xl text-white font-bold text-xs bg-amber-500">
                ✍️ Write a Review
              </Link>
              <Link to="/alerts" onClick={() => setMobileOpen(false)} className="w-full block text-center py-2.5 rounded-xl text-slate-700 font-bold text-xs bg-slate-100">
                🔔 Admission Alerts 2026
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Exact Collegedunia Multi-Step Study Preference Modal ────────────────────────────── */}
      {goalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-fadeIn border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header matching Collegedunia screenshot */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-[#08162d]">
                Select Your Study Preference
              </h3>
              <button onClick={() => setGoalModalOpen(false)} className="text-sky-600 hover:text-sky-700 font-extrabold text-xs cursor-pointer">
                Skip ✕
              </button>
            </div>

            {/* STEP 1: Course Selection matching Collegedunia screenshot 2 */}
            {modalStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                {/* Search Bar matching Collegedunia input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search and Select Your Course"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Categorized Courses matching Collegedunia design */}
                <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-1">
                  {courseCategories.map((cat) => {
                    const filtered = cat.courses.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
                    if (searchQuery && filtered.length === 0) return null;
                    return (
                      <div key={cat.category} className="space-y-2.5">
                        <h4 className="text-xs font-black text-[#08162d] flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.category}</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {(searchQuery ? filtered : cat.courses).map((course) => {
                            const isSelected = selectedGoal === course;
                            return (
                              <button
                                key={course}
                                onClick={() => handleSelectCourse(course)}
                                className={`group flex items-center justify-between p-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer text-left ${isSelected ? "border-sky-500 bg-sky-50/70 text-sky-700 shadow-2xs" : "border-slate-200/90 bg-white hover:border-sky-400 hover:bg-sky-50/30 text-slate-700"}`}
                              >
                                <span>{course}</span>
                                <ChevronRight />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Location Selection matching Collegedunia screenshot 3 */}
            {modalStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                {/* Summary bar matching Collegedunia screenshot 3 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-wrap font-bold text-slate-700">
                    <span className="text-slate-400">Your Selected Goal is:</span>
                    <span className="flex items-center gap-1 text-slate-800 font-extrabold"><CheckCircle /> Country: India</span>
                    <span className="flex items-center gap-1 text-slate-800 font-extrabold"><CheckCircle /> Course: {selectedGoal}</span>
                  </div>
                  <button onClick={() => setModalStep(1)} className="text-sky-600 hover:underline font-black text-xs flex items-center gap-1">
                    ✏️ Modify
                  </button>
                </div>

                {/* Search Bar for State */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search / Select Your Preferred City or state"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-1">
                  {/* BOX 1: POPULAR STATES */}
                  <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                    <h4 className="text-xs font-black text-[#08162d] flex items-center gap-2">
                      <span>🏛️</span>
                      <span>Popular States</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {popularStates.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((st) => {
                        const isSelected = selectedCity === st.name;
                        return (
                          <button
                            key={st.name}
                            onClick={() => handleSelectLocation(st.name)}
                            className={`p-3 rounded-xl border text-xs font-extrabold text-center transition-all cursor-pointer flex flex-col items-center justify-center h-16 ${isSelected ? "border-sky-500 bg-sky-50 text-sky-700 shadow-xs ring-2 ring-sky-400/30" : "border-slate-200/90 bg-white hover:border-sky-400 hover:bg-slate-50 text-slate-700"}`}
                          >
                            <span className="text-xs font-black">{st.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* BOX 2: POPULAR CITIES */}
                  <div className="space-y-2.5 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70">
                    <h4 className="text-xs font-black text-[#08162d] flex items-center gap-2">
                      <span>🏙️</span>
                      <span>Popular Cities</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {popularCities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((ct) => {
                        const isSelected = selectedCity === ct.name;
                        return (
                          <button
                            key={ct.name}
                            onClick={() => handleSelectLocation(ct.name)}
                            className={`p-3 rounded-xl border text-xs font-extrabold text-center transition-all cursor-pointer flex flex-col items-center justify-center h-16 ${isSelected ? "border-amber-500 bg-amber-50 text-amber-700 shadow-xs ring-2 ring-amber-400/30" : "border-slate-200/90 bg-white hover:border-amber-400 hover:bg-amber-50/20 text-slate-700"}`}
                          >
                            <span className="text-xs font-black">{ct.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── Persistent Floating Smart AI Recommendation Trigger Widget ───────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setRecModalOpen(true)}
          className="group bg-gradient-to-r from-[#08162d] via-[#102a56] to-[#e28a00] text-white font-black text-xs px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer border-2 border-white/80 animate-bounce"
          title="Find Top Colleges with AI"
        >
          <span className="text-base group-hover:rotate-12 transition-transform">🎓</span>
          <span>Smart AI College Finder</span>
        </button>
      </div>

      {/* ── Smart Recommendation Full Screen Modal Overlay ────────────── */}
      {recModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-5xl my-8 animate-fadeIn">
            <SmartLeadRecommendationSystem onClose={() => setRecModalOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────── */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#08162d" }} className="text-white border-t border-[rgba(255,255,255,0.10)] text-xs py-8 px-4 md:px-10 text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-slate-400 font-medium">
            © Copyright 2026 College Dakhla (AAKRITI EDU SERVICES). All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicRoutes;

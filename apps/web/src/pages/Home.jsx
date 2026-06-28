import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { getColleges, getExams, getBlogs, getCourses, getTestimonials, createLead } from "../lib/api";
import SmartLeadRecommendationSystem from "../components/SmartLeadRecommendationSystem";


/* ── Developer Vector SVGs ────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);
const StarIcon = () => (
  <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const ArrowRight = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);
const ArrowRightCircle = () => (
  <svg className="w-4 h-4 text-slate-400 group-hover:text-[#e28a00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8l4 4m0 0l-4 4m4-4H8" />
  </svg>
);

/* Static Data Constants */
const STREAMS = [
  { name: "Management",  icon: "💼", count: "7,632", courses: ["MBA", "PGDM", "BBA", "Executive MBA"] },
  { name: "Commerce",    icon: "📊", count: "5,003", courses: ["B.Com", "M.Com", "CA", "CS"] },
  { name: "Arts",        icon: "🎨", count: "5,885", courses: ["BA", "MA", "BFA", "MFA"] },
  { name: "Engineering", icon: "⚙️",  count: "8,216", courses: ["B.Tech", "M.Tech", "BE", "Diploma"] },
];

const STATS = [
  { value: "25,000+", label: "Colleges Listed" },
  { value: "100%",    label: "Expert Counselling" },
  { value: "500+",    label: "Partner Institutes" },
  { value: "50,000+", label: "Students Helped" },
];

const TOP_COURSES = [
  "BE/B.Tech", "ME/M.Tech", "Polytechnic", "BE/B.Tech Lateral",
  "M.Phil/Ph.D in Engineering", "Diploma in Engineering", "AME", "Diploma Courses"
];

const ADMISSION_ITEMS = [
  { text: "B.Tech Admission 2026", link: "/colleges?stream=Engineering" },
  { text: "Haryana B.Tech Admission 2026", link: "/colleges?state=Haryana&stream=Engineering" },
  { text: "Rajasthan B.Tech Admissions 2026", link: "/colleges?state=Rajasthan&stream=Engineering" },
  { text: "Telangana B.Tech Admissions 2026", link: "/colleges?state=Telangana&stream=Engineering" },
  { text: "UP B.Tech Admission 2026", link: "/colleges?state=Uttar%20Pradesh&stream=Engineering" }
];

const AGENCIES = ["Collegedunia", "Indiatoday", "The Week", "NIRF", "Outlook", "IIRF", "TOI"];

/* Rich News Stories for each specific tab matching exact screenshot */
const NEWS_TAB_STORIES = {
  "Exam Alerts": [
    { title: "What is a good score in MHT CET 2026?", date: "May 21, 2026", desc: "A Score Of 150 Marks Or Above Out Of 200 Is Considered A Good Score In MHT CET 2026 For General (Open) Category Candidates. Based On MH..." },
    { title: "VITEEE 2026 Registration Begins @viteee.vit.ac.in for...", date: "Oct 26, 2025", desc: "The Vellore Institute Of Technology (VIT) Has Officially Released The VITEEE 2026 Application Form. The Last Date Of Application Is 31st..." },
    { title: "Top 10 Android Apps for JEE Main 2026 Preparation", date: "Aug 21, 2025", desc: "Are You Looking For The Best Apps For JEE Exam Preparation 2026? Every Year, More Than 12 Lakh Aspirants Appear For JEE Main And..." },
    { title: "JEE Main 2022 Question Paper with Solutions PDF", date: "Apr 7, 2025", desc: "JEE Main 2022 Question Papers Available For Download Conducted JEE Main Exam Shift Wise Questions and Answer Keys." }
  ],
  "College Alerts": [
    { title: "IIT Bombay Launches New AI & Data Science B.Tech Program", date: "Jun 14, 2026", desc: "IIT Bombay has announced admissions for its newly structured 4-year B.Tech in Artificial Intelligence. Seat matrix released." },
    { title: "BITS Pilani Announces Merit Scholarship Scheme 2026", date: "May 28, 2026", desc: "BITS Pilani opens tuition fee waiver scholarships for top percentile rankers in BITSAT 2026 examination across campuses." },
    { title: "DTU Delhi Campus Placement Report 2026 Released", date: "May 10, 2026", desc: "Delhi Technological University records highest domestic package of 64 LPA with over 1,200 total offers placed." },
    { title: "Manipal Academy (MAHE) Online Application Deadline Extended", date: "Apr 18, 2026", desc: "Candidates applying for MET 2026 engineering admissions can submit completed application forms with late fee." }
  ],
  "Admission Alerts": [
    { title: "JoSAA Counseling 2026 Schedule & Seat Matrix Out", date: "Jun 20, 2026", desc: "Joint Seat Allocation Authority releases detailed registration dates for IIT, NIT, IIIT, and GFTI admission rounds." },
    { title: "UPTAC Counselling 2026 Registration Starts for AKTU Colleges", date: "Jun 02, 2026", desc: "Uttar Pradesh Technical Admission Counselling begins verification for state B.Tech colleges through JEE Main scores." },
    { title: "MHT CET 2026 CAP Round 1 Option Form Filling Begins", date: "May 30, 2026", desc: "State Common Entrance Test Cell Maharashtra activates college choice locking link for engineering degree courses." },
    { title: "REAP Rajasthan B.Tech Counselling merit list released", date: "May 12, 2026", desc: "Rajasthan Engineering Admission Process publishes state merit ranks based on Class 12 PCM percentile aggregate." }
  ]
};

/* Fallback Exam cards matching user screenshot exact data */
const FALLBACK_EXAMS = [
  { _id: "ex1", examName: "JEE Main", examMode: "Online Exam", participatingCollegesCount: 1986, examDate: "2026-04-02", examLevel: "National" },
  { _id: "ex2", examName: "JEE Advanced", examMode: "Online Exam", participatingCollegesCount: 31, examDate: "2026-05-17", examLevel: "National" },
  { _id: "ex3", examName: "CUET", examMode: "Offline Exam", participatingCollegesCount: 115, examDate: "2026-05-11", examLevel: "National" },
  { _id: "ex4", examName: "TS EAMCET", examMode: "Online Exam", participatingCollegesCount: 180, examDate: "2026-05-15", examLevel: "State" }
];

const inputCls =
  "w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#e28a00] transition-colors placeholder-slate-400 bg-slate-50";

/* Live-search hook */
const useLiveSearch = (query) => {
  const [dq, setDq] = useState("");
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) { setDq(""); return; }
    const t = setTimeout(() => setDq(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);
  const { data, isFetching } = useQuery({
    queryKey: ["liveSearch", dq],
    queryFn: () => getColleges({ search: dq, limit: 6 }),
    enabled: dq.length >= 2,
    staleTime: 30000,
  });
  return { results: data?.items || [], isFetching, active: dq.length >= 2 };
};

const Home = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const formTimer = useRef(null);

  // Slider Refs
  const collegesSliderRef = useRef(null);
  const newsSliderRef = useRef(null);
  const testimonialsSliderRef = useRef(null);
  const examsSliderRef = useRef(null);

  const [search, setSearch] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [activeNewsTab, setActiveNewsTab] = useState("Exam Alerts");
  const [activeAgency, setActiveAgency] = useState("Collegedunia");

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", city: "", course: "" });
  const [formStatus, setFormStatus] = useState("idle");

  const [newsletterData, setNewsletterData] = useState({ email: "", phone: "", course: "Engineering" });
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);

  const { results, isFetching, active } = useLiveSearch(search);

  // Fetch real data from Backend
  const { data: collegesRes } = useQuery({ queryKey: ["home-colleges"], queryFn: () => getColleges({ limit: 20 }) });
  const { data: examsRes } = useQuery({ queryKey: ["home-exams"], queryFn: () => getExams({ limit: 10 }) });
  const { data: testimonialsRes } = useQuery({ queryKey: ["home-testimonials"], queryFn: () => getTestimonials({ limit: 10 }) });

  const collegesList = collegesRes?.items || [];
  const rawExamsList = examsRes?.items || [];
  const examsList = rawExamsList.length > 0 ? rawExamsList : FALLBACK_EXAMS;
  const testimonialsList = testimonialsRes?.items || [];

  useEffect(() => { if (active) setShowDrop(true); }, [active]);
  useEffect(() => {
    const h = (e) => { if (!searchRef.current?.contains(e.target)) setShowDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => () => clearTimeout(formTimer.current), []);

  const scrollSlider = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowDrop(false);
    if (search.trim()) navigate(`/colleges?search=${encodeURIComponent(search.trim())}`);
  };

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      await createLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim() || undefined,
        course: formData.course || undefined,
        source: "home_page",
      });
      setFormStatus("success");
      setFormData({ name: "", email: "", phone: "", city: "", course: "" });
    } catch {
      setFormStatus("error");
    }
    clearTimeout(formTimer.current);
    formTimer.current = setTimeout(() => setFormStatus("idle"), 5000);
  }, [formData]);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterData.email) return;
    setNewsletterSubmitting(true);
    try {
      await createLead({ email: newsletterData.email, phone: newsletterData.phone, course: newsletterData.course, source: "newsletter" });
      setNewsletterDone(true);
      setNewsletterData({ email: "", phone: "", course: "Engineering" });
    } catch (err) {
      console.error(err);
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const currentNewsStories = NEWS_TAB_STORIES[activeNewsTab] || NEWS_TAB_STORIES["Exam Alerts"];

  return (
    <div className="bg-[#f8fafc] text-slate-800 space-y-16 pb-16 overflow-hidden">

      {/* ── 1. HERO SEARCH SECTION ───────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#08162d] to-[#0f2343] py-16 md:py-24 px-6 md:px-10 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#e28a00] text-xs font-black px-4 py-1.5 rounded-full border border-white/10">
            ⚡ COLLEGE DAKHLA • INDIA'S #1 ADMISSION PLATFORM
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Find Over <span className="text-[#e28a00]">25,000+ Colleges</span> &amp; Courses in India
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Compare authentic cutoff scores, fee structures, verified student reviews, and NIRF rankings in real-time.
          </p>

          {/* Search Bar */}
          <div ref={searchRef} className="relative max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-white rounded-full p-2 shadow-2xl">
                <div className="pl-4 text-slate-400"><SearchIcon /></div>
                <input
                  className="flex-1 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none bg-transparent placeholder-slate-400"
                  placeholder="Type college name (e.g. IIT Bombay, DTU, BITS)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => { if (active) setShowDrop(true); }}
                />
                <button type="submit" className="bg-[#e28a00] hover:bg-[#c67900] text-white font-extrabold px-8 py-3.5 rounded-full text-xs transition-all shadow-md">
                  Search
                </button>
              </div>
            </form>

            {/* Dropdown */}
            {showDrop && active && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-left text-slate-800">
                {isFetching && <div className="p-4 text-xs font-bold text-slate-400">Searching colleges...</div>}
                {!isFetching && results.length === 0 && <div className="p-4 text-xs font-bold text-slate-400">No colleges found.</div>}
                {!isFetching && results.map((c) => (
                  <Link key={c._id} to={`/college/${c.slug}`} onClick={() => setShowDrop(false)} className="flex items-center gap-3 p-3.5 hover:bg-amber-50/50 border-b border-slate-100 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 font-bold text-xs text-slate-700">
                      {c.shortName?.slice(0, 4) || "COL"}
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#08162d]">{c.collegeName}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{c.location || `${c.city || ''}, ${c.state || ''}`}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-[#e28a00]">{s.value}</div>
                <div className="text-xs text-slate-400 font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-16">
        {/* ── 2. STREAM DISCIPLINES ────────────────────────────────── */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[#e28a00] text-xs font-extrabold uppercase tracking-widest">Your Career Pathway</p>
            <h2 className="text-2xl md:text-3xl font-black text-[#08162d]">Explore Top Stream Disciplines</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STREAMS.map((s) => (
              <Link key={s.name} to={`/courses?stream=${encodeURIComponent(s.name)}`}
                className="group bg-white border border-slate-200 hover:border-[#e28a00] hover:shadow-lg rounded-2xl p-5 transition-all">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-extrabold text-[#08162d] text-base group-hover:text-[#e28a00] transition-colors">{s.name}</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">{s.count} Colleges</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.courses.map((c) => (
                    <span key={c} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. TOP UNIVERSITIES/COLLEGES FOR BE/B.TECH (With SLIDER + View All) ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#08162d] tracking-tight">
                Top Universities/Colleges For BE/B.Tech
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Explore featured engineering campuses with verified reviews</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button onClick={() => scrollSlider(collegesSliderRef, "left")} className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-all shadow-sm">‹</button>
                <button onClick={() => scrollSlider(collegesSliderRef, "right")} className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-all shadow-sm">›</button>
              </div>
              <Link to="/colleges" className="text-xs font-extrabold text-[#e28a00] hover:underline flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                View All Colleges &rarr;
              </Link>
            </div>
          </div>

          <div ref={collegesSliderRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
            {collegesList.map((col) => (
              <div key={col._id} className="min-w-[300px] md:min-w-[360px] max-w-[360px] snap-start bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group shrink-0">
                <div className="relative h-44 bg-slate-800 overflow-hidden">
                  <img
                    src={col.bannerImage || col.image || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80"}
                    alt={col.collegeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute top-3 right-3 bg-[#08162d]/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20">
                    cd 10/10
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-full bg-white text-[#08162d] font-black text-xs flex items-center justify-center shrink-0 border-2 border-white shadow-md">
                      {col.shortName?.slice(0, 4) || "IIT"}
                    </div>
                    <div className="leading-tight">
                      <h3 className="text-xs font-black drop-shadow-md line-clamp-1">{col.collegeName}</h3>
                      <p className="text-[10px] text-slate-200 font-semibold drop-shadow-md">
                        {col.location || `${col.city}, ${col.state}`} | AICTE, UGC
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#08162d] line-clamp-1">B.Tech Computer Science and Engineering</span>
                      <span className="flex items-center gap-1 font-black text-slate-800 shrink-0"><StarIcon /> {col.rating || 4.5}/5</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#e28a00] font-black text-sm">₹{(col.fees ? (col.fees / 100000).toFixed(2) : "2.20")} Lacs <span className="text-[10px] text-slate-400 font-semibold">Total Fees</span></span>
                      <span className="text-[10px] text-slate-400 font-semibold">420 reviews</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 border-t border-slate-100 pt-2">
                      {col.bestFor || col.rankingText || `Ranked ${col.ranking || 1} out of 500 Collegedunia`}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-bold text-slate-700">
                    <Link to={`/college/${col.slug}`} className="flex items-center justify-between hover:text-[#e28a00] transition-colors">
                      <span>View All Courses and fees</span>
                      <span>&rsaquo;</span>
                    </Link>
                    <Link to={`/college/${col.slug}`} className="flex items-center justify-between hover:text-[#e28a00] transition-colors">
                      <span>Download Brochure</span>
                      <span>&rsaquo;</span>
                    </Link>
                    <Link to="/compare" className="flex items-center justify-between hover:text-[#e28a00] transition-colors">
                      <span>Compare</span>
                      <span>&rsaquo;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. RECOMMENDED PARTNER COLLEGES ──────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-black text-[#08162d]">Recommended Partner Colleges</h2>
            <Link to="/colleges" className="text-xs font-extrabold text-[#e28a00] hover:underline">View All &rarr;</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {collegesList.slice(0, 3).map((college) => (
              <div key={college._id} className="bg-white border border-slate-200 hover:shadow-xl rounded-2xl p-6 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-[#08162d]">
                    {college.shortName || "COL"}
                  </div>
                  <div className="flex items-center gap-1 text-[#e28a00] text-xs font-extrabold px-2.5 py-1 rounded-full bg-[rgba(226,138,0,0.10)]">
                    <StarIcon /> {college.rating || 4.5}
                  </div>
                </div>
                <h3 className="font-extrabold text-[#08162d] text-sm leading-snug group-hover:text-[#e28a00] transition-colors mb-1">
                  {college.collegeName}
                </h3>
                <p className="text-xs text-slate-500 mb-4">{college.location || `${college.city}, ${college.state}`}</p>
                <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                  <div>
                    <p className="text-slate-400 font-medium mb-0.5">Average Fee</p>
                    <p className="font-extrabold text-[#08162d]">₹{(college.fees ? college.fees.toLocaleString() : "1,50,000")} / Yr</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium mb-0.5">Highest Package</p>
                    <p className="font-extrabold text-emerald-600">{college.highestPackage || "18 LPA"}</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Rank #{college.ranking || 10}</span>
                  <Link to={`/college/${college.slug}`} className="flex items-center gap-1.5 text-[#e28a00] font-extrabold text-xs hover:gap-3 transition-all">
                    Apply Now <ArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. LATEST NEWS & STORIES ────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black text-[#08162d] tracking-tight">Latest News &amp; Stories</h2>
              <div className="flex items-center gap-3">
                {["Exam Alerts", "College Alerts", "Admission Alerts"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveNewsTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${
                      activeNewsTab === tab
                        ? "bg-[#08162d] text-white border-[#08162d] shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="flex items-center gap-1.5">
                <button onClick={() => scrollSlider(newsSliderRef, "left")} className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-all shadow-sm">‹</button>
                <button onClick={() => scrollSlider(newsSliderRef, "right")} className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-all shadow-sm">›</button>
              </div>
              <Link to="/blogs" className="text-xs font-extrabold text-[#e28a00] hover:underline flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                View All News &rarr;
              </Link>
            </div>
          </div>

          <div ref={newsSliderRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
            {currentNewsStories.map((story, idx) => (
              <div key={idx} className="min-w-[260px] md:min-w-[300px] max-w-[300px] snap-start bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 shrink-0">
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-[#08162d] leading-snug line-clamp-2 hover:text-[#e28a00] transition-colors">
                    <Link to="/blogs">{story.title}</Link>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{story.date}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{story.desc}</p>
                </div>
                <Link to="/blogs" className="text-xs font-extrabold text-slate-700 hover:text-[#e28a00] flex items-center justify-between border-t border-slate-100 pt-3">
                  <span>Read more</span>
                  <span>&rsaquo;</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. STUDENT TESTIMONIALS ─────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[#e28a00] text-xs font-extrabold uppercase tracking-widest">Verified Student Feedback</p>
              <h2 className="text-2xl md:text-3xl font-black text-[#08162d]">What Our Students Say</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button onClick={() => scrollSlider(testimonialsSliderRef, "left")} className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-all shadow-sm">‹</button>
                <button onClick={() => scrollSlider(testimonialsSliderRef, "right")} className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-all shadow-sm">›</button>
              </div>
              <Link to="/about" className="text-xs font-extrabold text-[#e28a00] hover:underline flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                View All Reviews &rarr;
              </Link>
            </div>
          </div>

          <div ref={testimonialsSliderRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
            {testimonialsList.map((t) => (
              <div key={t._id} className="min-w-[300px] md:min-w-[350px] max-w-[350px] snap-start bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between shrink-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed italic">&ldquo;{t.review}&rdquo;</p>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#08162d] text-white font-black text-xs flex items-center justify-center shrink-0">
                    {t.studentName?.slice(0, 2).toUpperCase() || "ST"}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#08162d] text-xs">{t.studentName}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{t.role || "Student"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. TOP ENGINEERING COURSES (PILL LINKS) ───────────────── */}
        <section className="space-y-4 bg-slate-50/70 p-6 md:p-8 rounded-3xl border border-slate-200/60">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#08162d]">Top Engineering Courses</h2>
            <Link to="/courses" className="text-xs font-extrabold text-[#e28a00] hover:underline">View All Courses &rarr;</Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {TOP_COURSES.map((course) => (
              <Link
                key={course}
                to={`/courses?search=${encodeURIComponent(course)}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-[#e28a00] rounded-full text-xs font-extrabold text-slate-700 hover:text-[#e28a00] transition-all shadow-sm group"
              >
                <span>{course}</span>
                <ArrowRightCircle />
              </Link>
            ))}
          </div>
        </section>

        {/* ── 8. SUBSCRIBE TO OUR NEWSLETTER ─────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 text-center space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-[#08162d]">Subscribe To Our News Letter</h2>
            <p className="text-xs text-slate-500 font-semibold">Get College Notifications, Exam Notifications and News Updates</p>
          </div>

          {newsletterDone ? (
            <div className="bg-emerald-50 text-emerald-700 font-bold p-4 rounded-2xl text-xs max-w-md mx-auto border border-emerald-200">
              ✓ Thank you for subscribing! You will receive instant admission updates.
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <input
                type="email"
                placeholder="✉ Enter your email id"
                value={newsletterData.email}
                onChange={(e) => setNewsletterData({ ...newsletterData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#e28a00]"
                required
              />
              <input
                type="tel"
                placeholder="📞 Enter your mobile no"
                value={newsletterData.phone}
                onChange={(e) => setNewsletterData({ ...newsletterData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#e28a00]"
              />
              <select
                value={newsletterData.course}
                onChange={(e) => setNewsletterData({ ...newsletterData, course: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#e28a00]"
              >
                <option value="Engineering">Choose your course</option>
                <option value="BE/B.Tech">BE/B.Tech</option>
                <option value="MBA/PGDM">MBA/PGDM</option>
                <option value="MBBS">MBBS</option>
              </select>
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="bg-[#ff6b00] hover:bg-[#e05e00] text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md uppercase tracking-wider text-center"
              >
                {newsletterSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </section>

        {/* ── 9. TOP BE/B.TECH EXAMS ──────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl md:text-2xl font-black text-[#08162d] tracking-tight">Top BE/B.Tech Exams</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button onClick={() => scrollSlider(examsSliderRef, "left")} className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-all shadow-sm">‹</button>
                <button onClick={() => scrollSlider(examsSliderRef, "right")} className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-all shadow-sm">›</button>
              </div>
              <Link to="/exams" className="text-xs font-extrabold text-[#e28a00] hover:underline flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                View All Exams &rarr;
              </Link>
            </div>
          </div>

          <div ref={examsSliderRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
            {examsList.map((exam) => (
              <div key={exam._id} className="min-w-[260px] md:min-w-[290px] max-w-[290px] snap-start bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 shrink-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      {exam.logo ? (
                        <img src={exam.logo} alt={exam.examName} className="w-full h-full object-contain p-1" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-[#e28a00] font-black text-xs flex items-center justify-center border border-amber-200">
                          {exam.examName?.slice(0, 3) || "EX"}
                        </div>
                      )}
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                      {exam.examMode || "Online Exam"}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#08162d]">{exam.examName}</h3>

                  <div className="space-y-1.5 text-xs border-t border-slate-100 pt-2">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Participating Colleges</span>
                      <span className="font-extrabold text-slate-800">{exam.participatingCollegesCount || 1986}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Exam Date</span>
                      <span className="font-extrabold text-slate-800">
                        {exam.examDate ? (typeof exam.examDate === "string" && exam.examDate.includes("-") ? new Date(exam.examDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : exam.examDate) : "April 02, 2026"}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Exam Level</span>
                      <span className="font-extrabold text-slate-800">{exam.examLevel || "National"}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-bold text-slate-700">
                  <Link to="/exams" className="flex items-center justify-between hover:text-[#e28a00]">
                    <span>Application Process</span>
                    <span>&rsaquo;</span>
                  </Link>
                  <Link to="/exams" className="flex items-center justify-between hover:text-[#e28a00]">
                    <span>Exam Info</span>
                    <span>&rsaquo;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 10. BE/B.TECH ADMISSION 2026 ──────────────────────────── */}
        <section className="space-y-4 bg-slate-50/70 p-6 md:p-8 rounded-3xl border border-slate-200/60">
          <h2 className="text-xl font-black text-[#08162d]">BE/B.Tech Admission 2026</h2>
          <div className="flex flex-wrap gap-3">
            {ADMISSION_ITEMS.map((item) => (
              <Link
                key={item.text}
                to={item.link}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-[#e28a00] rounded-full text-xs font-extrabold text-slate-700 hover:text-[#e28a00] transition-all shadow-sm group"
              >
                <span>{item.text}</span>
                <ArrowRightCircle />
              </Link>
            ))}
          </div>
        </section>

        {/* ── 11. BE/B.TECH COLLEGE RANKING 2026 ─────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-black text-[#08162d] tracking-tight">BE/B.Tech College Ranking 2026</h2>
            <Link to="/colleges" className="text-xs font-extrabold text-[#e28a00] hover:underline bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 flex items-center gap-1">
              View all Colleges &rarr;
            </Link>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <select className="bg-white border border-slate-300 rounded-full px-4 py-1.5 text-xs font-extrabold text-slate-700 focus:outline-none shrink-0">
              <option>Ranking: 2026</option>
              <option>Ranking: 2025</option>
            </select>
            <span className="text-xs font-bold text-slate-400 shrink-0">Agencies:</span>
            {AGENCIES.map((agency) => (
              <button
                key={agency}
                onClick={() => setActiveAgency(agency)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border shrink-0 cursor-pointer ${
                  activeAgency === agency
                    ? "bg-[#08162d] text-white border-[#08162d] shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {agency}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                  <th className="py-4 px-6">College</th>
                  <th className="py-4 px-6">Ranking ({activeAgency})</th>
                  <th className="py-4 px-6">Streams</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                {collegesList.slice(0, 8).map((col, idx) => (
                  <tr key={col._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {col.shortName?.slice(0, 3) || "IIT"}
                        </div>
                        <div>
                          <Link to={`/college/${col.slug}`} className="font-black text-[#08162d] hover:text-[#e28a00] transition-colors text-xs">
                            {col.collegeName}
                          </Link>
                          <div className="text-[10px] text-slate-400 font-semibold">{col.location || `${col.city}, ${col.state}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-700">{idx + 1} out of 500</td>
                    <td className="py-4 px-6 font-bold text-slate-700">Engineering</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 12. INTERACTIVE HELPDESK / LEAD CAPTURE FORM ───────────── */}
        <section className="py-10 bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-[#e28a00] text-xs font-extrabold uppercase tracking-widest">Interactive Helpdesk</p>
              <h2 className="text-3xl md:text-4xl font-black text-[#08162d] leading-tight">
                We&apos;re Here to Help and Ready to Hear from You
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm">
                Submit your profile details once. Our system automatically processes your qualifications against institutional requirements to provide a personalised guidance roadmap.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-2">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-xl">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <div className="font-extrabold text-[#08162d] text-sm">25,000+</div>
                    <div className="text-xs text-slate-500">Institutes Covered</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-xl">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-extrabold text-[#08162d] text-sm">100% Free</div>
                    <div className="text-xs text-slate-500">Expert Counselling</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-black text-[#08162d] mb-1">Request Callback / Apply Online</h3>
              <p className="text-xs text-slate-500 mb-6">Fill your details and we&apos;ll get back to you within 24 hours.</p>

              {formStatus === "success" ? (
                <div className="py-8 text-center space-y-3">
                  <div className="text-4xl">✅</div>
                  <p className="font-extrabold text-[#08162d] text-base">Query Submitted!</p>
                  <p className="text-xs text-slate-500">Our team will contact you shortly.</p>
                  <button onClick={() => setFormStatus("idle")} className="text-xs text-[#e28a00] font-bold hover:underline">
                    Submit another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
                  <input required placeholder="Full Name *" className={inputCls}
                    value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="email" placeholder="Email Address *" className={inputCls}
                      value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
                    <input required type="tel" placeholder="Phone Number *" maxLength={10} className={inputCls}
                      value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Your City" className={inputCls}
                      value={formData.city} onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))} />
                    <select className={`${inputCls} text-slate-600`}
                      value={formData.course} onChange={(e) => setFormData((p) => ({ ...p, course: e.target.value }))}>
                      <option value="">Choose Course Stream</option>
                      <option>Engineering (B.Tech / M.Tech)</option>
                      <option>Management (MBA / BBA)</option>
                      <option>Commerce (B.Com / M.Com)</option>
                      <option>Arts &amp; Humanities (BA / MA)</option>
                      <option>Medical / Pharmacy</option>
                    </select>
                  </div>
                  <button type="submit" disabled={formStatus === "loading"}
                    className="w-full text-white font-extrabold py-3.5 rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-2 bg-[#08162d] hover:bg-[#0f2343] shadow-md">
                    {formStatus === "loading" ? "Submitting..." : "✉ Submit Query"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;

import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "../lib/api";

/* ── Icons ───────────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 16 14" />
  </svg>
);
const FilterIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const ArrowRight = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

/* ── Stream colour map ───────────────────────────────────────────── */
const streamMeta = {
  Management:  { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Commerce:    { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  Engineering: { bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200"},
  Arts:        { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200"   },
  Medical:     { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200"    },
  Design:      { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
  Pharmacy:    { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200"   },
};
const defaultMeta = { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" };

/* ── Fallback static data ───────────────────────────────────────── */
const STATIC_COURSES = [
  { _id: "s1", courseName: "Bachelor of Commerce [B.Com]",              stream: "Commerce",    duration: "3 Years", entranceExam: "CUET / PU CET",    fees: "85,000/Yr"  },
  { _id: "s2", courseName: "Bachelor of Computer Applications [BCA]",   stream: "Engineering", duration: "3 Years", entranceExam: "TS DOST",           fees: "75,000/Yr"  },
  { _id: "s3", courseName: "Bachelor of Business Administration [BBA]", stream: "Management",  duration: "3 Years", entranceExam: "TS DOST",           fees: "1,20,000/Yr" },
  { _id: "s4", courseName: "Master of Computer Applications [MCA]",     stream: "Engineering", duration: "2 Years", entranceExam: "GATE / PG CET",     fees: "1,50,000/Yr" },
  { _id: "s5", courseName: "Master of Business Administration [MBA]",   stream: "Management",  duration: "2 Years", entranceExam: "CAT / MAT / XAT",   fees: "4,20,000/Yr" },
  { _id: "s6", courseName: "Bachelor of Arts [BA]",                     stream: "Arts",        duration: "3 Years", entranceExam: "CUET / Merit",       fees: "65,000/Yr"  },
  { _id: "s7", courseName: "Bachelor of Technology [B.Tech]",           stream: "Engineering", duration: "4 Years", entranceExam: "JEE / State CET",    fees: "2,20,000/Yr" },
  { _id: "s8", courseName: "Bachelor of Medicine & Surgery [MBBS]",     stream: "Medical",     duration: "5.5 Years",entranceExam: "NEET UG",           fees: "1,35,000/Yr"},
];

const ALL_STREAMS   = ["Management", "Commerce", "Engineering", "Arts", "Medical", "Design", "Pharmacy"];
const ALL_DURATIONS = ["2 Years", "3 Years", "4 Years", "5.5 Years"];

/* helper */
const fmtFee = (n) => {
  if (!n) return null;
  if (typeof n === "string") return n.includes("Yr") || n.includes("₹") ? n : `₹${n}`;
  return `₹${Number(n).toLocaleString("en-IN")} / Year`;
};

/* ═══════════════════════════════════════════════════════════════════
   COURSES PAGE
═══════════════════════════════════════════════════════════════════ */
const Courses = () => {
  const [searchParams] = useSearchParams();
  const initStream = ALL_STREAMS.find((s) =>
    (searchParams.get("stream") || "").toLowerCase().includes(s.toLowerCase())
  ) || "";

  const [search,   setSearch]   = useState(searchParams.get("search") || "");
  const [stream,   setStream]   = useState(initStream);
  const [duration, setDuration] = useState("");

  /* sync URL params if they change */
  useEffect(() => {
    const q = searchParams.get("search") || "";
    const s = ALL_STREAMS.find((x) =>
      (searchParams.get("stream") || "").toLowerCase().includes(x.toLowerCase())
    ) || "";
    setSearch(q);
    setStream(s);
  }, [searchParams]);

  /* ── Fetch from backend ─────────────────────────────────────── */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses", "all"],
    queryFn:  () => getCourses({ limit: 100 }),
    staleTime: 120000,
  });

  const apiCourses = data?.items?.length ? data.items : STATIC_COURSES;

  /* ── Client-side filter with smart keyword matching ─────────── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return apiCourses.filter((c) => {
      const name     = (c.courseName || c.name || "").toLowerCase();
      const desc     = (c.description || "").toLowerCase();
      const cStream  = (c.stream || c.category || "").toLowerCase();
      const cSub     = (c.subStream || "").toLowerCase();
      const cType    = (c.courseType || "").toLowerCase();
      const cDur     = (c.duration || "").toLowerCase();
      const entrance = (c.entranceExam || "").toLowerCase();

      let matchSearch = !q;
      if (q) {
        if (q.includes("b.tech") || q.includes("be/b.tech") || q.includes("be")) {
          matchSearch = name.includes("b.tech") || name.includes("bachelor of technology") || cStream.includes("engineering") || cType.includes("bachelor");
        } else if (q.includes("m.tech") || q.includes("me/m.tech") || q.includes("me")) {
          matchSearch = name.includes("m.tech") || name.includes("master of technology") || cType.includes("master");
        } else if (q.includes("polytechnic") || q.includes("diploma")) {
          matchSearch = name.includes("diploma") || cType.includes("diploma") || desc.includes("polytechnic");
        } else if (q.includes("ph.d") || q.includes("m.phil")) {
          matchSearch = name.includes("ph.d") || name.includes("m.phil") || cType.includes("doctor");
        } else if (q.includes("ame")) {
          matchSearch = name.includes("mechanical") || name.includes("robotics") || cSub.includes("mechanical") || cStream.includes("engineering");
        } else {
          matchSearch = name.includes(q) || desc.includes(q) || cStream.includes(q) || cSub.includes(q) || entrance.includes(q);
        }
      }

      const matchStream   = !stream   || cStream === stream.toLowerCase();
      const matchDuration = !duration || cDur === duration.toLowerCase();
      return matchSearch && matchStream && matchDuration;
    });
  }, [apiCourses, search, stream, duration]);

  const reset = () => { setSearch(""); setStream(""); setDuration(""); };

  const radioCls = "accent-[#e28a00] w-3.5 h-3.5 cursor-pointer";
  const inputCls = "w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#e28a00] transition-colors";

  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────── */}
      <section className="py-10 px-6 md:px-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#08162d] mb-1">
              Explore &amp; Find Your Best-Fit Course
            </h1>
            <p className="text-slate-500 text-sm">Refine, compare, and filter accredited academic programs and fee structures.</p>
          </div>
          {search && (
            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-full text-xs font-bold text-[#e28a00] flex items-center gap-2 self-start md:self-auto">
              <span>Showing results for: <strong>"{search}"</strong></span>
              <button onClick={() => setSearch("")} className="hover:text-black font-black">✕</button>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col lg:flex-row gap-8">

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <aside className="lg:w-52 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 sticky top-24 shadow-sm">
            <h3 className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-widest">
              <FilterIcon /> Filter Panel
            </h3>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Field Stream</p>
              <div className="space-y-2">
                {ALL_STREAMS.map((s) => (
                  <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="radio" className={radioCls} checked={stream === s}
                      onChange={() => setStream(stream === s ? "" : s)} />
                    <span className={`text-sm font-semibold transition-colors ${stream === s ? "text-[#e28a00]" : "text-slate-600 group-hover:text-[#e28a00]"}`}>
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Duration</p>
              <div className="space-y-2">
                {ALL_DURATIONS.map((d) => (
                  <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="radio" className={radioCls} checked={duration === d}
                      onChange={() => setDuration(duration === d ? "" : d)} />
                    <span className={`text-sm font-semibold transition-colors ${duration === d ? "text-[#e28a00]" : "text-slate-600 group-hover:text-[#e28a00]"}`}>
                      {d}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={reset}
              className="w-full text-xs font-bold text-slate-500 hover:text-[#e28a00] border border-slate-200 hover:border-[#e28a00] px-3 py-2 rounded-lg transition-all">
              Reset Filters
            </button>
          </div>
        </aside>

        {/* ── Main list ────────────────────────────────────────── */}
        <div className="flex-1 space-y-4">

          {/* Search */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2"><SearchIcon /></div>
            <input className={inputCls} placeholder="Search specific degrees or keywords…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {/* Count */}
          <p className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-700">{filtered.length}</strong> courses
            {stream   && <> in <strong style={{ color: "#e28a00" }}>{stream}</strong></>}
            {isLoading && <span className="ml-2 italic text-slate-300">loading live data…</span>}
            {isError   && <span className="ml-2 text-red-400">(showing cached data)</span>}
          </p>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && filtered.length === 0 && (
            <div className="py-20 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-semibold text-slate-700">No courses match "{search}".</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting your search filters or searching for another stream.</p>
              <button onClick={reset} className="mt-4 text-xs font-black bg-[#e28a00] text-white px-5 py-2.5 rounded-xl hover:bg-[#c67900] transition-all">
                Clear all filters
              </button>
            </div>
          )}

          {/* Course cards */}
          {!isLoading && filtered.map((course) => {
            const name     = course.courseName || course.name || "Untitled Course";
            const desc     = course.description || course.eligibility || course.desc || "";
            const cStream  = course.stream || course.category || "";
            const cSub     = course.subStream || "";
            const cDur     = course.duration || "";
            const entrance = course.entranceExam || course.entrance || "";
            const feeStr   = fmtFee(course.feeAmount || course.fees || course.fee);
            const review   = course.courseReview || "4.8/5";
            const meta     = streamMeta[cStream] || defaultMeta;

            return (
              <div key={course._id || course.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-lg space-y-4">

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {cStream && (
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${meta.bg} ${meta.text} ${meta.border}`}>
                      {cStream}
                    </span>
                  )}
                  {cSub && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {cSub}
                    </span>
                  )}
                  {cDur && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium ml-auto">
                      <ClockIcon /> {cDur}
                    </span>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base md:text-lg font-black text-[#08162d] leading-snug">{name}</h3>
                    {desc && (
                      <p className="text-xs text-slate-500 leading-relaxed mt-1.5 font-medium">
                        <strong>Eligibility / Details:</strong> {desc}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 bg-amber-50 border border-amber-200 text-[#e28a00] font-black text-xs px-3 py-1.5 rounded-xl self-start">
                    ★ {review} Rating
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {entrance && <div><span className="text-slate-400 font-bold">Entrance Exam:</span> {entrance}</div>}
                  {course.courseType && <div><span className="text-slate-400 font-bold">Degree Type:</span> {course.courseType}</div>}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <div>
                    {feeStr ? (
                      <>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Tuition Fee Amount</p>
                        <p className="text-lg font-black text-[#08162d]">{feeStr}</p>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400 font-medium">Fee details available on enquiry</p>
                    )}
                  </div>
                  <Link to="/contact"
                    className="inline-flex items-center gap-2 text-white font-extrabold px-6 py-3 rounded-xl text-xs transition-all active:scale-95 shrink-0 bg-[#e28a00] hover:bg-[#c67900] shadow-md">
                    Apply Now <ArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Courses;

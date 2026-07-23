import { useState } from "react";
import { Link } from "react-router-dom";

/* ── Icons ───────────────────────────────────────────────────────── */
const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const LocationIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const FeesIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const RankIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);
const CoursesIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const BuildingIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

/* ── Shared stat pill ────────────────────────────────────────────── */
const Stat = ({ icon, label, value, bg, border, iconColor, valueColor }) => (
  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold text-slate-600 ${bg} ${border}`}>
    <span className={iconColor}>{icon}</span>
    <span>{label}: <strong className={valueColor}>{value}</strong></span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   COLLEGE CARD
   variant="row"  → horizontal card for /colleges list
   variant="grid" → vertical card (default, for homepage etc.)
═══════════════════════════════════════════════════════════════════ */
const CollegeCard = ({ college, variant = "grid" }) => {
  const [imgError, setImgError] = useState(false);

  const logo = college.logo && !imgError
    ? <img src={college.logo} alt={college.collegeName} onError={() => setImgError(true)} className="max-h-full max-w-full object-contain" />
    : <BuildingIcon />;

  const rating   = college.rating   ? college.rating.toFixed(1) + "/5" : "4.0/5";
  const fees     = college.fees     ? `₹${Number(college.fees).toLocaleString()}` : "N/A";
  const rank     = college.ranking  ? `#${college.ranking}` : "N/A";
  const courses  = college.courses?.length ?? 0;
  const location = [college.city, college.state].filter(Boolean).join(", ");
  const typeTag  = college.collegeType || "University";
  const estd     = college.establishedYear;

  /* ── ROW variant ─────────────────────────────────────────────── */
  if (variant === "row") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full group transition-all duration-300"
        style={{ boxShadow: "0 2px 8px rgba(8,22,45,0.06)" }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(8,22,45,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(8,22,45,0.06)";  e.currentTarget.style.transform = "translateY(0)"; }}>

        {/* Left: logo + info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-2 shrink-0"
            style={{ boxShadow: "0 2px 8px rgba(99,102,241,0.10)" }}>
            {logo}
          </div>

          {/* Info */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-extrabold text-white px-2.5 py-0.5 rounded-full tracking-wide"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                {typeTag}
              </span>
              {estd && (
                <span className="text-[10px] uppercase font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Estd {estd}
                </span>
              )}
            </div>
            <h3 className="text-base md:text-lg font-black text-[#08162d] leading-snug max-w-xl transition-colors"
              style={{ color: "#08162d" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#6366f1"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#08162d"}>
              {college.collegeName}
            </h3>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><LocationIcon />{location}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Stat icon={<StarIcon />}    label="Rating"  value={rating}  bg="bg-amber-50"   border="border-amber-200"   iconColor="text-amber-500"   valueColor="text-amber-700" />
              <Stat icon={<FeesIcon />}    label="Fees"    value={fees}    bg="bg-emerald-50" border="border-emerald-200" iconColor="text-emerald-500" valueColor="text-emerald-700" />
              <Stat icon={<RankIcon />}    label="Rank"    value={rank}    bg="bg-purple-50"  border="border-purple-200"  iconColor="text-purple-500"  valueColor="text-purple-700" />
              <Stat icon={<CoursesIcon />} label="Courses" value={courses} bg="bg-blue-50"    border="border-blue-200"    iconColor="text-blue-500"    valueColor="text-blue-700" />
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="shrink-0">
          <Link to={`/college/${college.slug}`}
            className="inline-flex items-center justify-center rounded-xl text-white font-extrabold px-6 py-2.5 text-xs transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 4px 14px rgba(99,102,241,0.40)" }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.90"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
            View Details →
          </Link>
        </div>
      </div>
    );
  }

  /* ── GRID variant ────────────────────────────────────────────── */
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300"
      style={{ boxShadow: "0 2px 8px rgba(8,22,45,0.06)" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(8,22,45,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(8,22,45,0.06)";  e.currentTarget.style.transform = "translateY(0)"; }}>

      {/* Logo area */}
      <div className="flex items-center gap-3 p-5 border-b border-slate-100">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
          {logo}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] uppercase font-extrabold text-white px-2 py-0.5 rounded-full"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            {typeTag}
          </span>
          <h3 className="text-sm font-extrabold text-[#08162d] line-clamp-2 leading-snug mt-1 group-hover:text-indigo-600 transition-colors">
            {college.collegeName}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
            <LocationIcon />{location}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 p-4 flex-1">
        <Stat icon={<StarIcon />}    label="Rating"  value={rating}  bg="bg-amber-50"   border="border-amber-200"   iconColor="text-amber-500"   valueColor="text-amber-700" />
        <Stat icon={<FeesIcon />}    label="Fees"    value={fees}    bg="bg-emerald-50" border="border-emerald-200" iconColor="text-emerald-500" valueColor="text-emerald-700" />
        <Stat icon={<RankIcon />}    label="Rank"    value={rank}    bg="bg-purple-50"  border="border-purple-200"  iconColor="text-purple-500"  valueColor="text-purple-700" />
        <Stat icon={<CoursesIcon />} label="Courses" value={courses} bg="bg-blue-50"    border="border-blue-200"    iconColor="text-blue-500"    valueColor="text-blue-700" />
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Link to={`/college/${college.slug}`}
          className="block text-center rounded-xl text-white font-extrabold px-4 py-2.5 text-xs transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.90"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CollegeCard;

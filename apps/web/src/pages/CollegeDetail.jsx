import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCollegeBySlug } from "../lib/api";
import LeadForm from "../components/forms/LeadForm";

const CollegeDetail = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("Info");
  const [logoErr, setLogoErr] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["college", slug],
    queryFn: () => getCollegeBySlug(slug)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="text-5xl mb-4">🏛️</div>
        <h2 className="text-xl font-black text-navy mb-2">College Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">
          The requested college page does not exist or has been disabled.
        </p>
        <Link
          to="/colleges"
          className="bg-amber hover:bg-[#c67900] text-white font-extrabold px-6 py-3 rounded-full text-sm transition-all shadow-amber"
        >
          Browse All Colleges
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "Info",      label: "Overview",      content: data.sections?.about            || "No overview available." },
    { id: "Courses",   label: "Courses & Fees", content: data.sections?.coursesFees      || "No course details available." },
    { id: "Admission", label: "Admission",      content: `${data.sections?.admissionProcess || ""} ${data.sections?.eligibility || ""}` },
    { id: "CutOff",    label: "Cut-Off",        content: data.sections?.cutoff           || "No cutoff data available." },
    { id: "Placement", label: "Placement",      content: data.sections?.placements       || "No placement data available." },
    { id: "Reviews",   label: "Reviews",        content: data.sections?.reviews          || "No student reviews yet." },
  ];

  const activeContent = tabs.find((t) => t.id === activeTab)?.content || "";

  return (
    <div>
      {/* ── 1. College Hero Banner ──────────────────────────────── */}
      <section className="hero-bg relative text-white py-10 px-6 md:px-12 overflow-hidden">
        {data.bannerImage && (
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${data.bannerImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08162d] via-[#08162d]/95 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Logo + Name */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white rounded-2xl p-2.5 flex items-center justify-center shadow-lg shrink-0">
              {data.logo && !logoErr
                ? <img src={data.logo} alt={data.collegeName} onError={() => setLogoErr(true)} className="max-h-full max-w-full object-contain" />
                : <span className="text-4xl">🏛️</span>}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  {data.collegeType || "University"}
                </span>
                {data.establishedYear && (
                  <span className="bg-white/10 border border-white/20 text-white/80 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                    Estd {data.establishedYear}
                  </span>
                )}
              </div>
              <h1 className="text-xl md:text-3xl font-black text-white leading-tight">
                {data.collegeName}
              </h1>
              <p className="text-white/70 text-sm flex items-center gap-1.5">
                📍 {[data.city, data.state].filter(Boolean).join(", ") || "India"}
              </p>
            </div>
          </div>

          {/* Right: Rating + CTA */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">
                {data.rating ? data.rating.toFixed(1) : "4.0"}
                <span className="text-base font-semibold text-white/50">/5</span>
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.round(data.rating || 4) ? "text-amber" : "text-white/20"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            {data.ranking && (
              <span className="bg-amber/20 border border-amber/30 text-amber text-xs font-bold px-3 py-1 rounded-full">
                National Rank #{data.ranking}
              </span>
            )}
          </div>
        </div>

        {/* Quick stats strip */}
        {(data.fees || data.highestPackage || data.accreditation) && (
          <div className="relative max-w-7xl mx-auto mt-6 flex flex-wrap gap-5">
            {data.fees && (
              <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Avg Fee / Year</p>
                <p className="text-sm font-extrabold text-white">₹{Number(data.fees).toLocaleString()}</p>
              </div>
            )}
            {data.highestPackage && (
              <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Highest Package</p>
                <p className="text-sm font-extrabold text-amber">{data.highestPackage}</p>
              </div>
            )}
            {data.accreditation && (
              <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Accreditation</p>
                <p className="text-sm font-extrabold text-white">{data.accreditation}</p>
              </div>
            )}
            {data.hostelAvailability === "Yes" && (
              <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Hostel</p>
                <p className="text-sm font-extrabold text-emerald-400">Available</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── 2. Tabs + Sidebar ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid gap-8 lg:grid-cols-[2.2fr_1fr] items-start pb-16">

        {/* Left: Tab content */}
        <div className="space-y-5">
          {/* Tab bar */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-amber text-white shadow-amber"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-card">
            <h2 className="text-lg font-black text-navy border-l-4 border-amber pl-3 mb-4">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <div
              className="prose prose-sm max-w-none text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: activeContent }}
            />
          </div>

          {/* Courses section */}
          {data.courses?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
              <h3 className="text-base font-black text-navy mb-4">Mapped Courses</h3>
              <div className="flex flex-wrap gap-2">
                {data.courses.map((c) => (
                  <span
                    key={c._id || c}
                    className="bg-amber/10 border border-amber/20 text-amber font-bold text-xs px-3 py-1.5 rounded-full"
                  >
                    {c.courseName || c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-5">
          {/* Quick actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-navy">Interested in this College?</h3>
              <p className="text-xs text-slate-500 mt-1">Submit your enquiry for counselling and brochures.</p>
            </div>
            <div className="grid gap-2">
              <button
                onClick={() => document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full bg-amber hover:bg-[#c67900] text-white font-extrabold px-4 py-3 rounded-xl text-xs transition-all shadow-amber flex items-center justify-between"
              >
                <span>🚀 Apply Now</span>
                <span>→</span>
              </button>
              {data.brochureUrl && (
                <a
                  href={data.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl text-xs transition-all flex items-center justify-between"
                >
                  <span>📥 Download Brochure</span>
                  <span>↓</span>
                </a>
              )}
            </div>
          </div>

          {/* Key details card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-3">
            <h3 className="text-sm font-extrabold text-navy border-b border-slate-100 pb-2">College Details</h3>
            {[
              { label: "Type",          value: data.collegeType },
              { label: "State",         value: data.state },
              { label: "City",          value: data.city },
              { label: "Est. Year",     value: data.establishedYear },
              { label: "Scholarship",   value: data.scholarshipAvailable },
              { label: "Hostel",        value: data.hostelAvailability },
              { label: "Affiliation",   value: data.affiliation },
            ].filter((r) => r.value).map((row) => (
              <div key={row.label} className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{row.label}</span>
                <span className="font-extrabold text-navy">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Enquiry form */}
          <div id="enquiry-form" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card scroll-mt-24">
            <h3 className="text-sm font-extrabold text-navy mb-4 border-b border-slate-100 pb-2">
              Send Enquiry
            </h3>
            <LeadForm collegeId={data._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetail;

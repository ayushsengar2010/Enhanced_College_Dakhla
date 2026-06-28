import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getExams } from "../lib/api";

const STREAMS = ["Engineering", "Management", "Medical", "Commerce", "Arts", "Design", "Pharmacy"];
const STATUSES = ["Active", "Upcoming", "Ongoing", "Completed"];

const fmt = (d) => {
  if (!d) return "TBA";
  if (typeof d === "string" && !d.includes("T")) return d;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const CalIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ExamsPage = () => {
  const [stream, setStream]   = useState("");
  const [status, setStatus]   = useState("");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["exams", { stream, status, search, page }],
    queryFn:  () => getExams({ stream: stream || undefined, status: status || undefined, search: search || undefined, page, limit: 12 }),
    staleTime: 60000,
  });

  const exams = data?.items || [];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#08162d] to-[#0f2343] py-14 px-6 md:px-10 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">Exam Calendar 2026</h1>
        <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
          Track registration dates, admit cards, results, cutoffs, and deadlines for major competitive entrance exams.
        </p>
        <div className="text-xs text-slate-400 mt-4 font-medium">
          <Link to="/" className="hover:text-[#e28a00]">Home</Link>
          <span className="mx-2">//</span>Exams Directory
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-10 py-4 sticky top-[61px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <input
              className="border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#e28a00] bg-slate-50 w-full sm:w-64"
              placeholder="Search exams (e.g. JEE, NEET, CUET)..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select className="border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#e28a00] bg-white text-slate-700"
              value={stream} onChange={(e) => { setStream(e.target.value); setPage(1); }}>
              <option value="">All Streams</option>
              {STREAMS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {["", ...STATUSES].map((s) => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
                  status === s
                    ? "bg-[#08162d] text-white border-[#08162d] shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-[#e28a00]"
                }`}>
                {s || "All Exams"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <section className="py-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 animate-pulse space-y-4 border border-slate-200">
                  <div className="h-6 bg-slate-200 rounded w-1/2"/>
                  <div className="h-4 bg-slate-200 rounded w-3/4"/>
                  <div className="h-20 bg-slate-100 rounded w-full"/>
                </div>
              ))}
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl max-w-xl mx-auto p-8 shadow-sm">
              <div className="text-5xl mb-3">📅</div>
              <h3 className="font-black text-xl text-[#08162d]">No entrance exams found</h3>
              <p className="text-xs text-slate-400 mt-1">Try resetting your search query or stream filter.</p>
              <button onClick={() => { setSearch(""); setStream(""); setStatus(""); }} className="mt-4 text-xs font-bold bg-[#e28a00] text-white px-5 py-2.5 rounded-xl hover:bg-[#c67900] transition-all">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  onClick={() => setSelectedExam(exam)}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-[#e28a00] font-black text-xs flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                        {exam.shortName?.slice(0, 3) || exam.examName?.slice(0, 3) || "EX"}
                      </div>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-slate-200">
                        {exam.examMode || "Online Exam"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-[#08162d] group-hover:text-[#e28a00] transition-colors line-clamp-1">{exam.examName}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">{exam.conductingBody || "National Body"}</p>
                    </div>

                    <div className="space-y-1.5 text-xs border-t border-slate-100 pt-2">
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Participating Colleges</span>
                        <span className="font-extrabold text-slate-800">{exam.participatingCollegesCount || 10}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Exam Date</span>
                        <span className="font-extrabold text-slate-800">{fmt(exam.examDate)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Exam Level</span>
                        <span className="font-extrabold text-slate-800">{exam.examLevel || "National"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-bold text-slate-700">
                    <div className="flex items-center justify-between group-hover:text-[#e28a00] transition-colors">
                      <span>Application Process &amp; Info</span>
                      <span>&rsaquo;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data?.pages > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}
                className="px-5 py-2.5 text-xs font-black border border-slate-200 rounded-xl hover:border-[#e28a00] disabled:opacity-40 transition-all bg-white">
                ← Previous Page
              </button>
              <span className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl">{page} / {data.pages}</span>
              <button disabled={page === data.pages} onClick={() => setPage(page + 1)}
                className="px-5 py-2.5 text-xs font-black border border-slate-200 rounded-xl hover:border-[#e28a00] disabled:opacity-40 transition-all bg-white">
                Next Page →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── DETAILED EXAM MODAL ─────────────────────────────────────── */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedExam(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center transition-all"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#e28a00] font-black text-xl flex items-center justify-center border-2 border-amber-200 shrink-0">
                {selectedExam.shortName?.slice(0, 3) || selectedExam.examName?.slice(0, 3)}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-50 text-[#e28a00] px-2.5 py-1 rounded-full border border-amber-200">
                  {selectedExam.stream || "Engineering"} • {selectedExam.examLevel || "National"}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-[#08162d] mt-1">{selectedExam.examName}</h2>
                <p className="text-xs text-slate-400 font-semibold">Conducting Body: {selectedExam.conductingBody || "NTA"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">App Start</div>
                <div className="text-xs font-black text-[#08162d] mt-0.5">{fmt(selectedExam.applicationStart)}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
                <div className="text-[10px] text-red-400 font-bold uppercase">App Deadline</div>
                <div className="text-xs font-black text-red-700 mt-0.5">{fmt(selectedExam.applicationEnd)}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                <div className="text-[10px] text-blue-400 font-bold uppercase">Exam Date</div>
                <div className="text-xs font-black text-blue-700 mt-0.5">{fmt(selectedExam.examDate)}</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Result Date</div>
                <div className="text-xs font-black text-emerald-700 mt-0.5">{fmt(selectedExam.resultDate)}</div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {selectedExam.description && (
                <div>
                  <h4 className="font-black text-[#08162d] uppercase tracking-wider text-[10px] text-slate-400 mb-1">Overview</h4>
                  <div className="prose text-slate-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: selectedExam.description }} />
                </div>
              )}
              {selectedExam.eligibility && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-black text-[#08162d] uppercase tracking-wider text-[10px] text-slate-400 mb-1">Eligibility Criteria</h4>
                  <p className="text-slate-700 font-bold">{selectedExam.eligibility}</p>
                </div>
              )}
              {selectedExam.examPattern && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-black text-[#08162d] uppercase tracking-wider text-[10px] text-slate-400 mb-1">Exam Pattern &amp; Structure</h4>
                  <p className="text-slate-700 font-bold">{selectedExam.examPattern}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-700">Application Fee: ₹{selectedExam.applicationFee || 1000}</span>
                <span className="font-extrabold text-[#e28a00]">{selectedExam.participatingCollegesCount || 10} Participating Institutes</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                to={`/colleges?stream=${encodeURIComponent(selectedExam.stream || "")}`}
                className="flex-1 bg-[#08162d] hover:bg-[#0f2343] text-white text-center font-extrabold py-3 rounded-xl text-xs transition-all shadow-md"
              >
                Explore Participating Colleges
              </Link>
              {selectedExam.officialWebsite && (
                <a
                  href={selectedExam.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#e28a00] hover:bg-[#c67900] text-white text-center font-extrabold py-3 rounded-xl text-xs transition-all shadow-md"
                >
                  Visit Official Portal ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsPage;

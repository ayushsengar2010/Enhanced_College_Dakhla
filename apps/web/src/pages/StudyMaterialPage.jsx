import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudyMaterials } from "../lib/api";

const STREAMS = ["Engineering","Management","Medical","Commerce","Science","Arts","Design","Pharmacy","Law","Computer Applications","Other"];
const TYPES   = ["Syllabus","Notes","Sample Paper","Previous Year","Ebook","Video Link","Other"];

const typeIcon = { Syllabus:"📋", Notes:"📝", "Sample Paper":"📄", "Previous Year":"🗂️", Ebook:"📕", "Video Link":"🎬", Other:"📦" };

const StudyMaterialPage = () => {
  const [stream, setStream] = useState("");
  const [type,   setType]   = useState("");
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["study-materials", { stream, type, search, page }],
    queryFn:  () => getStudyMaterials({ stream: stream||undefined, type: type||undefined, search: search||undefined, page, limit: 12 }),
    staleTime: 60000,
  });
  const items = data?.items || [];

  return (
    <div>
      <section className="hero-bg py-14 px-6 md:px-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Study Materials</h1>
        <p className="text-[rgba(255,255,255,0.60)] text-sm max-w-xl mx-auto">
          Download syllabi, notes, sample papers, e-books, and previous year papers for all major exams.
        </p>
        <p className="text-[rgba(255,255,255,0.40)] text-xs mt-3">
          <Link to="/" className="hover:text-[#e28a00]">Home</Link><span className="mx-2">//</span>Study Materials
        </p>
      </section>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-10 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3">
          <input className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#e28a00] w-52"
            placeholder="Search materials…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select className="border border-slate-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:border-[#e28a00]"
            value={stream} onChange={(e) => { setStream(e.target.value); setPage(1); }}>
            <option value="">All Streams</option>
            {STREAMS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="border border-slate-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:border-[#e28a00]"
            value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <section className="py-10 px-6 md:px-10 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map((n) => <div key={n} className="bg-white rounded-2xl p-6 animate-pulse h-44 border border-slate-200"/>)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="text-5xl mb-3">📚</div>
              <p className="font-semibold">No study materials found</p>
              <p className="text-xs mt-1">Admin can add materials from the dashboard</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((m) => (
                <div key={m._id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 hover:shadow-lg transition-all flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: "rgba(226,138,0,0.10)" }}>
                      {typeIcon[m.type] || "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {m.type}
                      </span>
                      <h3 className="text-sm font-black text-[#08162d] mt-1 leading-snug">{m.title}</h3>
                      <p className="text-xs text-slate-400 font-medium">{m.subject} {m.examName ? `• ${m.examName}` : ""}</p>
                    </div>
                  </div>
                  {m.description && <div className="text-xs text-slate-500 leading-relaxed line-clamp-2 prose" dangerouslySetInnerHTML={{ __html: m.description }} />}
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-2 border-t border-slate-100">
                    <span className="font-medium">🌐 {m.language || "English"}</span>
                    <span className="font-medium">⬇️ {m.downloads || 0} downloads</span>
                  </div>
                  {m.fileUrl ? (
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        try { getStudyMaterialById(m._id); } catch(e){}
                      }}
                      className="block text-center text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: "#e28a00" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c67900"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e28a00"}
                    >
                      👁️ View Material / Open Link ↗
                    </a>
                  ) : (
                    <Link to="/contact" className="block text-center text-xs font-extrabold py-2.5 rounded-xl border border-[#e28a00] text-[#e28a00] hover:bg-[rgba(226,138,0,0.05)] transition-all">
                      Request Access
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {data?.pages > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              <button disabled={page===1} onClick={() => setPage(p=>p-1)}
                className="px-4 py-2 text-sm font-bold border border-slate-200 rounded-xl disabled:opacity-40 hover:border-[#e28a00] transition-all">← Prev</button>
              <span className="px-4 py-2 text-sm font-bold text-slate-600">{page} / {data.pages}</span>
              <button disabled={page===data.pages} onClick={() => setPage(p=>p+1)}
                className="px-4 py-2 text-sm font-bold border border-slate-200 rounded-xl disabled:opacity-40 hover:border-[#e28a00] transition-all">Next →</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudyMaterialPage;

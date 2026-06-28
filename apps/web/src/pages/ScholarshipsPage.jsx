import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScholarships } from "../lib/api";

const TYPES = ["Merit","Need-based","Sports","Minority","State","Central","Olympiad","Other"];
const STREAMS = ["Engineering","Management","Medical","Commerce","Arts","Law","Design","Other"];

const ScholarshipsPage = () => {
  const [type,   setType]   = useState("");
  const [stream, setStream] = useState("");
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["scholarships", { type, stream, search, page }],
    queryFn:  () => getScholarships({ type: type || undefined, stream: stream || undefined, search: search || undefined, page, limit: 12 }),
    staleTime: 60000,
  });

  const items = data?.items || [];
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : null;

  return (
    <div>
      <section className="hero-bg py-14 px-6 md:px-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Scholarships & Olympiads</h1>
        <p className="text-[rgba(255,255,255,0.60)] text-sm max-w-xl mx-auto">
          Discover merit, need-based, state, and Olympiad scholarships for Indian students.
        </p>
        <p className="text-[rgba(255,255,255,0.40)] text-xs mt-3">
          <Link to="/" className="hover:text-[#e28a00]">Home</Link><span className="mx-2">//</span>Scholarships
        </p>
      </section>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-10 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3">
          <input className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#e28a00] w-52"
            placeholder="Search scholarships…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select className="border border-slate-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:border-[#e28a00]"
            value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="border border-slate-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:border-[#e28a00]"
            value={stream} onChange={(e) => { setStream(e.target.value); setPage(1); }}>
            <option value="">All Streams</option>
            {STREAMS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <section className="py-10 px-6 md:px-10 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map((n) => <div key={n} className="bg-white rounded-2xl p-6 animate-pulse h-48 border border-slate-200"/>)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="text-5xl mb-3">🎓</div>
              <p className="font-semibold">No scholarships found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((s) => (
                <div key={s._id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 hover:shadow-lg transition-all flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[rgba(226,138,0,0.10)] text-[#e28a00] border border-[rgba(226,138,0,0.20)]">
                        {s.type}
                      </span>
                      <h3 className="text-base font-black text-[#08162d] mt-2 leading-snug">{s.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">By {s.provider}</p>
                    </div>
                    {s.amount && (
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] text-slate-400 font-semibold">Amount</p>
                        <p className="text-sm font-black text-emerald-600">{s.amount}</p>
                      </div>
                    )}
                  </div>
                  {s.description && <div className="text-xs text-slate-500 leading-relaxed line-clamp-2 prose" dangerouslySetInnerHTML={{ __html: s.description }} />}
                  {s.eligibility && (
                    <div className="bg-slate-50 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Eligibility</p>
                      <p className="text-xs text-slate-600 line-clamp-2">{s.eligibility}</p>
                    </div>
                  )}
                  {s.stream?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {s.stream.map((st) => (
                        <span key={st} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{st}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-100">
                    {s.lastDate ? (
                      <p className="text-xs text-red-500 font-bold">Last Date: {fmt(s.lastDate)}</p>
                    ) : <span />}
                    {s.officialLink ? (
                      <a href={s.officialLink} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-extrabold text-[#e28a00] hover:underline">Apply Now →</a>
                    ) : (
                      <Link to="/contact" className="text-xs font-extrabold text-[#e28a00] hover:underline">Enquire →</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {data?.pages > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}
                className="px-4 py-2 text-sm font-bold border border-slate-200 rounded-xl disabled:opacity-40 hover:border-[#e28a00] transition-all">← Prev</button>
              <span className="px-4 py-2 text-sm font-bold text-slate-600">{page} / {data.pages}</span>
              <button disabled={page === data.pages} onClick={() => setPage(page + 1)}
                className="px-4 py-2 text-sm font-bold border border-slate-200 rounded-xl disabled:opacity-40 hover:border-[#e28a00] transition-all">Next →</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ScholarshipsPage;

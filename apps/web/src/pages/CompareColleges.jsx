import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getColleges } from "../lib/api";

const MAX = 3;

const Row = ({ label, vals, mono }) => (
  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
    <td className="px-4 py-3 text-xs font-bold text-slate-500 w-36 bg-slate-50">{label}</td>
    {vals.map((v, i) => (
      <td key={i} className={`px-4 py-3 text-sm font-semibold text-[#08162d] border-l border-slate-100 ${mono ? "font-mono" : ""}`}>
        {v || <span className="text-slate-300">—</span>}
      </td>
    ))}
    {Array.from({ length: MAX - vals.length }).map((_, i) => (
      <td key={`empty-${i}`} className="px-4 py-3 border-l border-slate-100 text-slate-200 text-sm">—</td>
    ))}
  </tr>
);

const CompareColleges = () => {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState([]);

  const { data } = useQuery({
    queryKey: ["colleges-compare", search],
    queryFn:  () => getColleges({ search: search || undefined, limit: 8 }),
    enabled:  search.length >= 2,
    staleTime: 30000,
  });

  const results = (data?.items || []).filter((c) => !selected.find((s) => s._id === c._id));

  useEffect(() => {
    getColleges({ limit: 2 }).then(res => {
      if (res?.items && res.items.length >= 2) {
        setSelected(res.items.slice(0, 2));
      }
    }).catch(err => console.error(err));
  }, []);

  const add    = (c) => { if (selected.length < MAX) setSelected([...selected, c]); };
  const remove = (id) => setSelected(selected.filter((c) => c._id !== id));

  return (
    <div>
      <section className="hero-bg py-14 px-6 md:px-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Compare Colleges</h1>
        <p className="text-[rgba(255,255,255,0.60)] text-sm max-w-xl mx-auto">
          Select up to 3 colleges and compare fees, placements, rankings, and facilities side by side.
        </p>
        <p className="text-[rgba(255,255,255,0.40)] text-xs mt-3">
          <Link to="/" className="hover:text-[#e28a00]">Home</Link><span className="mx-2">//</span>Compare
        </p>
      </section>

      <section className="py-10 px-6 md:px-10 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Search + Selected chips */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4" style={{ boxShadow:"0 2px 8px rgba(8,22,45,0.06)" }}>
            <div>
              <p className="text-sm font-extrabold text-[#08162d] mb-2">
                Add colleges to compare <span className="text-slate-400 font-medium text-xs">({selected.length}/{MAX} selected)</span>
              </p>
              <div className="relative max-w-md">
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e28a00] transition-colors"
                  placeholder="Search college name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search.length >= 2 && results.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-10 overflow-hidden">
                    {results.map((c) => (
                      <button key={c._id} onClick={() => { add(c); setSearch(""); }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-[rgba(226,138,0,0.05)] border-b border-slate-100 last:border-0 transition-colors">
                        <p className="font-bold text-[#08162d]">{c.collegeName}</p>
                        <p className="text-xs text-slate-400">{[c.city, c.state].filter(Boolean).join(", ")}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected chips */}
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selected.map((c) => (
                  <div key={c._id} className="flex items-center gap-2 bg-[rgba(226,138,0,0.10)] border border-[rgba(226,138,0,0.30)] text-[#e28a00] rounded-full px-3 py-1.5">
                    <span className="text-xs font-bold truncate max-w-[160px]">{c.collegeName}</span>
                    <button onClick={() => remove(c._id)} className="text-[#e28a00] hover:text-red-500 font-black text-sm leading-none">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comparison table */}
          {selected.length >= 2 ? (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden" style={{ boxShadow:"0 4px 16px rgba(8,22,45,0.08)" }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-[#08162d] text-white">
                      <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-widest w-36">Criteria</th>
                      {selected.map((c) => (
                        <th key={c._id} className="px-4 py-4 text-left text-sm font-black border-l border-[rgba(255,255,255,0.10)]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="line-clamp-2 leading-snug">{c.collegeName}</span>
                            <button onClick={() => remove(c._id)} className="text-[rgba(255,255,255,0.40)] hover:text-red-400 text-lg leading-none shrink-0">×</button>
                          </div>
                        </th>
                      ))}
                      {Array.from({ length: MAX - selected.length }).map((_, i) => (
                        <th key={i} className="px-4 py-4 border-l border-[rgba(255,255,255,0.10)] text-[rgba(255,255,255,0.30)] text-xs font-medium">
                          + Add College
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <Row label="Location"        vals={selected.map((c) => [c.city, c.state].filter(Boolean).join(", "))} />
                    <Row label="Type"             vals={selected.map((c) => c.collegeType || "—")} />
                    <Row label="Est. Year"        vals={selected.map((c) => c.establishedYear?.toString() || "—")} />
                    <Row label="Ranking"          vals={selected.map((c) => c.ranking ? `#${c.ranking}` : "—")} />
                    <Row label="Rating"           vals={selected.map((c) => c.rating ? `${c.rating.toFixed(1)}/5` : "—")} />
                    <Row label="Avg Fees / Yr"    vals={selected.map((c) => c.fees ? `₹${Number(c.fees).toLocaleString("en-IN")}` : "—")} mono />
                    <Row label="Highest Pkg"      vals={selected.map((c) => c.highestPackage || "—")} />
                    <Row label="Avg Package"      vals={selected.map((c) => c.averagePackage || "—")} />
                    <Row label="Hostel"           vals={selected.map((c) => c.hostelAvailability || "—")} />
                    <Row label="Scholarship"      vals={selected.map((c) => c.scholarshipAvailable || "—")} />
                    <Row label="Accreditation"    vals={selected.map((c) => c.accreditation || "—")} />
                    <Row label="Affiliation"      vals={selected.map((c) => c.affiliation || "—")} />
                    <Row label="Courses Mapped"   vals={selected.map((c) => c.courses?.length?.toString() || "0")} />
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-4 text-xs font-bold text-slate-500">View Details</td>
                      {selected.map((c) => (
                        <td key={c._id} className="px-4 py-4 border-l border-slate-100">
                          <Link to={`/college/${c.slug}`}
                            className="inline-block text-xs font-extrabold text-white px-4 py-2 rounded-xl transition-all"
                            style={{ backgroundColor:"#e28a00" }}>
                            View →
                          </Link>
                        </td>
                      ))}
                      {Array.from({ length: MAX - selected.length }).map((_, i) => <td key={i} className="border-l border-slate-100"/>)}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
              <div className="text-5xl mb-3">⚖️</div>
              <p className="font-extrabold text-[#08162d] text-lg">Select at least 2 colleges to compare</p>
              <p className="text-slate-400 text-sm mt-1">Search and add colleges using the box above</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CompareColleges;

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import { getColleges, compareColleges } from "../lib/api";

const MAX = 4;
const GOLD = "#c07e3e";
const COLORS = ["#c07e3e", "#0d9488", "#4f46e5", "#d97706", "#e11d48"];

/* ── Helpers ─────────────────────────────────────────────────── */
const fmtINR = (n) => {
  if (n == null || isNaN(n)) return "—";
  return `₹${Number(n).toLocaleString("en-IN")}`;
};

const fmtRating = (r) => (r != null ? `${Number(r).toFixed(1)}/5` : "—");

const fmtRank = (r) => (r != null && r > 0 ? `#${r}` : "—");

const fmtPercent = (v, max) => {
  if (!v || !max || max === 0) return 0;
  return Math.min(100, Math.round((v / max) * 100));
};

/* ── Row component ───────────────────────────────────────────── */
const CompareRow = ({ label, vals, mono, bestIdx }) => (
  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
    <td className="px-4 py-3.5 text-xs font-bold text-slate-500 w-36 bg-slate-50/80 sticky left-0">
      {label}
    </td>
    {vals.map((v, i) => (
      <td
        key={i}
        className={`px-4 py-3.5 text-sm border-l border-slate-100 ${
          i === bestIdx ? "bg-emerald-50/60 font-bold text-emerald-700" : "font-semibold text-[#08162d]"
        } ${mono ? "font-mono tracking-tight" : ""}`}
      >
        {v ?? <span className="text-slate-300">—</span>}
        {i === bestIdx && <span className="ml-1.5 text-emerald-500 text-xs">✓</span>}
      </td>
    ))}
  </tr>
);

/* ═══════════════════════════════════════════════════════════════
   COMPARE COLLEGES PAGE
   ═══════════════════════════════════════════════════════════════ */
const CompareColleges = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ state: "", collegeType: "" });
  const [showShareToast, setShowShareToast] = useState(false);
  const [chartView, setChartView] = useState("fees"); // fees | rating | package
  const [loadingFromUrl, setLoadingFromUrl] = useState(false);

  /* ── Load from URL params on mount ────────────────────────── */
  useEffect(() => {
    const ids = searchParams.get("compare");
    if (ids) {
      const idList = ids.split(",").filter(Boolean);
      if (idList.length >= 2) {
        setLoadingFromUrl(true);
        compareColleges(idList)
          .then((colleges) => {
            setSelected(Array.isArray(colleges) ? colleges : []);
          })
          .catch(() => {})
          .finally(() => setLoadingFromUrl(false));
      }
    }
  }, []);

  /* ── Update URL when selections change ────────────────────── */
  const updateUrl = useCallback((cols) => {
    const ids = cols.map((c) => c._id);
    if (ids.length >= 2) {
      setSearchParams({ compare: ids.join(",") });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  /* ── College search ────────────────────────────────────────── */
  const searchParamsQuery = {};
  if (filters.state) searchParamsQuery.state = filters.state;
  if (filters.collegeType) searchParamsQuery.collegeType = filters.collegeType;

  const { data: searchData } = useQuery({
    queryKey: ["colleges-compare", search, filters],
    queryFn: () => getColleges({
      search: search || undefined,
      limit: 8,
      ...searchParamsQuery,
    }),
    enabled: search.length >= 2,
    staleTime: 30000,
  });

  const results = useMemo(
    () => (searchData?.items || []).filter((c) => !selected.find((s) => s._id === c._id)),
    [searchData, selected],
  );

  const add = (c) => {
    if (selected.length < MAX) {
      const next = [...selected, c];
      setSelected(next);
      updateUrl(next);
      setSearch("");
    }
  };
  const remove = (id) => {
    const next = selected.filter((c) => c._id !== id);
    setSelected(next);
    updateUrl(next);
  };

  /* ── Share / Copy Link ─────────────────────────────────────── */
  const copyShareLink = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("compare", selected.map((c) => c._id).join(","));
    navigator.clipboard.writeText(url.toString()).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    });
  }, [selected]);

  /* ── Compute best index for each metric ───────────────────── */
  const computeBest = (key, higherBetter = true) => {
    const vals = selected.map((c) => Number(c[key]));
    if (vals.some(isNaN)) return -1;
    return higherBetter
      ? vals.indexOf(Math.max(...vals))
      : vals.indexOf(Math.min(...vals));
  };

  const bestFee = computeBest("fees", false);
  const bestRating = computeBest("rating", true);
  const bestRank = computeBest("ranking", false); // lower rank = better

  /* ── Chart data ────────────────────────────────────────────── */
  const chartData = useMemo(() => {
    if (selected.length < 2) return [];
    return selected.map((c, i) => ({
      name: c.shortName || c.collegeName?.split(" ").slice(0, 2).join(" ") || `College ${i + 1}`,
      fees: Number(c.fees) || 0,
      rating: Number(c.rating) || 0,
      ranking: Number(c.ranking) || 0,
      placement: Number(c.averagePackage?.replace(/[^0-9.]/g, "")) || 0,
      fill: COLORS[i % COLORS.length],
    }));
  }, [selected]);

  /* ── Radar data ────────────────────────────────────────────── */
  const radarData = useMemo(() => {
    if (selected.length < 2) return [];
    const maxFee = Math.max(...selected.map((c) => Number(c.fees) || 0));
    const maxPkg = Math.max(...selected.map((c) => Number(c.averagePackage?.replace(/[^0-9.]/g, "")) || 0));

    const metrics = [
      { key: "Affordability", getVal: (c) => maxFee ? 100 - fmtPercent(Number(c.fees), maxFee) + 20 : 50 },
      { key: "Rating", getVal: (c) => fmtPercent(Number(c.rating), 5) },
      { key: "Ranking", getVal: (c) => Number(c.ranking) > 0 ? Math.max(10, 100 - Number(c.ranking) / 10) : 50 },
      { key: "Placement", getVal: (c) => fmtPercent(Number(c.averagePackage?.replace(/[^0-9.]/g, "")), maxPkg || 1) },
    ];

    return metrics.map((m) => {
      const entry = { metric: m.key };
      selected.forEach((c, i) => {
        entry[`col${i}`] = Math.min(100, m.getVal(c));
      });
      return entry;
    });
  }, [selected]);

  /* ── Print handler ──────────────────────────────────────────── */
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      {/* ── Share toast ──────────────────────────────────────────── */}
      {showShareToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-bold animate-slide-down">
          🔗 Link copied to clipboard!
        </div>
      )}

      {/* ── Hero Banner ──────────────────────────────────────────── */}
      <section className="hero-bg py-14 px-6 md:px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">Compare Colleges</h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
            Side-by-side comparison of fees, ratings, placements, and more. 
            Select up to {MAX} colleges and find your best fit.
          </p>
          <p className="text-white/40 text-xs mt-3">
            <Link to="/" className="hover:text-[#e28a00] transition-colors">Home</Link>
            <span className="mx-2">//</span>Compare
          </p>
        </div>
      </section>

      <section className="py-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Search & Filters Panel ──────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Search */}
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Search Colleges
                </label>
                <div className="relative">
                  <input
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e28a00] transition-colors bg-slate-50"
                    placeholder="Type college name to search…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search.length >= 2 && results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden max-h-64 overflow-y-auto">
                      {results.map((c) => (
                        <button
                          key={c._id}
                          onClick={() => add(c)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-amber-50 border-b border-slate-100 last:border-0 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-black text-xs shrink-0">
                            {c.collegeName?.[0] || "C"}
                          </div>
                          <div>
                            <p className="font-bold text-[#08162d] text-sm">{c.collegeName}</p>
                            <p className="text-xs text-slate-400">{[c.city, c.state].filter(Boolean).join(", ")}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* State filter */}
              <div className="w-full md:w-40">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">State</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#e28a00] bg-slate-50"
                  placeholder="All states"
                  value={filters.state}
                  onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}
                />
              </div>

              {/* Type filter */}
              <div className="w-full md:w-40">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Type</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#e28a00] bg-slate-50"
                  value={filters.collegeType}
                  onChange={(e) => setFilters((f) => ({ ...f, collegeType: e.target.value }))}
                >
                  <option value="">All Types</option>
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="Semi-Government">Semi-Government</option>
                  <option value="Autonomous">Autonomous</option>
                  <option value="Deemed">Deemed</option>
                </select>
              </div>

              {/* Selected count */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 whitespace-nowrap">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black ${
                  selected.length >= 2 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                }`}>
                  {selected.length}
                </span>
                <span>/ {MAX} selected</span>
              </div>
            </div>

            {/* Selected chips */}
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                {selected.map((c, i) => (
                  <div
                    key={c._id}
                    className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
                    style={{
                      backgroundColor: `${COLORS[i % COLORS.length]}15`,
                      borderColor: `${COLORS[i % COLORS.length]}40`,
                      color: COLORS[i % COLORS.length],
                      borderWidth: 1,
                    }}
                  >
                    <span className="truncate max-w-[180px]">{c.collegeName}</span>
                    <button
                      onClick={() => remove(c._id)}
                      className="hover:text-red-500 font-black text-sm leading-none ml-0.5 opacity-60 hover:opacity-100 transition-all"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {selected.length >= 2 && (
                  <button
                    onClick={copyShareLink}
                    className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border border-slate-200 text-slate-500 hover:border-[#e28a00] hover:text-[#e28a00] transition-all ml-auto"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    Share Link
                  </button>
                )}

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                  Print
                </button>
              </div>
            )}
          </div>

          {/* ── Loading from URL state ─────────────────────────── */}
          {loadingFromUrl && (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-[#e28a00] border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-500 font-semibold">Loading comparison...</span>
              </div>
            </div>
          )}

          {/* ── No selection state ──────────────────────────────── */}
          {!loadingFromUrl && selected.length < 2 && (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">⚖️</div>
              <h2 className="font-black text-2xl text-[#08162d]">Select Colleges to Compare</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                Add at least 2 colleges using the search bar above.
                You can compare up to {MAX} colleges side by side.
              </p>
              {!search && (
                <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] text-slate-400">
                  <span className="px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">Try searching "IIT"</span>
                  <span className="px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">Try "NIT"</span>
                  <span className="px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">Try "Engineering"</span>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
             COMPARISON VIEW
             ════════════════════════════════════════════════════════ */}
          {selected.length >= 2 && (
            <>
              {/* ── Chart Tabs ────────────────────────────────── */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Charts:</span>
                {[
                  { key: "fees", label: "Fees Comparison" },
                  { key: "rating", label: "Ratings" },
                  { key: "package", label: "Placement Packages" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setChartView(tab.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      chartView === tab.key
                        ? "bg-[#08162d] text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-[#e28a00] hover:text-[#e28a00]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Bar Chart ──────────────────────────────────── */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
                <h3 className="text-sm font-black text-[#08162d] mb-4">
                  {chartView === "fees" && "💰 Annual Fees Comparison"}
                  {chartView === "rating" && "⭐ Rating Comparison"}
                  {chartView === "package" && "📊 Average Placement Package"}
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                      <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                        labelStyle={{ fontWeight: 600, color: "#334155" }}
                        formatter={(value) => [
                          chartView === "fees" ? fmtINR(value) :
                          chartView === "rating" ? `${value}/5` :
                          `₹${value}L`,
                          chartView === "fees" ? "Annual Fees" :
                          chartView === "rating" ? "Rating" : "Avg Package"
                        ]}
                      />
                      <Bar
                        dataKey={chartView === "fees" ? "fees" : chartView === "rating" ? "rating" : "placement"}
                        radius={[6, 6, 0, 0]}
                        barSize={chartData.length <= 3 ? 60 : 40}
                      >
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── Radar Chart ────────────────────────────────── */}
              {selected.length >= 2 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
                  <h3 className="text-sm font-black text-[#08162d] mb-1">🕸️ Overall Score Comparison</h3>
                  <p className="text-[11px] text-slate-400 mb-4">Based on affordability, rating, ranking, and placement</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} cx="50%" cy="50%">
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="metric" fontSize={11} tick={{ fill: "#64748b", fontWeight: 600 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} tick={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                        />
                        {selected.map((_, i) => (
                          <Radar
                            key={i}
                            name={selected[i]?.shortName || selected[i]?.collegeName || `College ${i + 1}`}
                            dataKey={`col${i}`}
                            stroke={COLORS[i % COLORS.length]}
                            fill={COLORS[i % COLORS.length]}
                            fillOpacity={0.08}
                            strokeWidth={2}
                          />
                        ))}
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Radar legend */}
                  <div className="flex flex-wrap gap-4 justify-center mt-3">
                    {selected.map((c, i) => (
                      <div key={c._id} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        {c.shortName || c.collegeName?.split(" ").slice(0, 2).join(" ") || `College ${i + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Comparison Table ────────────────────────────── */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm print:break-inside-avoid">
                <div className="bg-[#08162d] text-white px-5 py-3.5 flex items-center justify-between">
                  <h3 className="text-sm font-black tracking-wide">📋 Detailed Comparison</h3>
                  <span className="text-[10px] text-white/50 font-medium">✓ = Best value</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-100/80">
                        <th className="px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500 w-36">Criteria</th>
                        {selected.map((c, i) => (
                          <th
                            key={c._id}
                            className="px-4 py-3.5 text-left text-sm font-black text-[#08162d] border-l border-slate-200"
                          >
                            <div className="flex items-center gap-2" style={{ color: COLORS[i % COLORS.length] }}>
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                              {c.shortName || c.collegeName?.split(" ").slice(0, 2).join(" ")}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <CompareRow label="Full Name" vals={selected.map((c) => c.collegeName)} />
                      <CompareRow label="Location" vals={selected.map((c) => [c.city, c.state].filter(Boolean).join(", "))} />
                      <CompareRow label="Type" vals={selected.map((c) => c.collegeType || "—")} />
                      <CompareRow label="Established" vals={selected.map((c) => c.establishedYear?.toString() || "—")} />
                      <CompareRow label="Ranking" vals={selected.map((c) => fmtRank(c.ranking))} bestIdx={bestRank} />
                      <CompareRow label="Rating" vals={selected.map((c) => fmtRating(c.rating))} bestIdx={bestRating} />
                      <CompareRow label="Annual Fees" vals={selected.map((c) => fmtINR(c.fees))} mono bestIdx={bestFee} />
                      <CompareRow label="Highest Package" vals={selected.map((c) => c.highestPackage || "—")} />
                      <CompareRow label="Average Package" vals={selected.map((c) => c.averagePackage || "—")} />
                      <CompareRow label="Courses Offered" vals={selected.map((c) => `${c.courses?.length || 0} courses`)} />
                      <CompareRow label="Hostel" vals={selected.map((c) => c.hostelAvailability || "—")} />
                      <CompareRow label="Scholarship" vals={selected.map((c) => c.scholarshipAvailable || "—")} />
                      <CompareRow label="Accreditation" vals={selected.map((c) => c.accreditation || "—")} />
                      <CompareRow label="Affiliation" vals={selected.map((c) => c.affiliation || "—")} />
                      <CompareRow label="Cutoff Exam" vals={selected.map((c) => c.cutoffExam || "—")} />
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50">
                        <td className="px-4 py-4 text-xs font-bold text-slate-500">View Details</td>
                        {selected.map((c) => (
                          <td key={c._id} className="px-4 py-4 border-l border-slate-100">
                            <Link
                              to={`/college/${c.slug}`}
                              className="inline-block text-xs font-extrabold text-white px-5 py-2.5 rounded-xl transition-all hover:opacity-90 shadow-sm"
                              style={{ backgroundColor: COLORS[selected.indexOf(c) % COLORS.length] }}
                            >
                              View →
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── Quick Stats Row ──────────────────────────────── */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {selected.slice(0, 4).map((c, i) => (
                  <div
                    key={c._id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                        {c.shortName || c.collegeName?.split(" ")[0]}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <div className="text-lg font-black text-[#08162d]">{fmtRating(c.rating)}</div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Rating</div>
                      </div>
                      <div>
                        <div className="text-lg font-black text-[#08162d]">{fmtINR(c.fees)}</div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Annual Fees</div>
                      </div>
                      <div>
                        <div className="text-lg font-black text-[#08162d]">{fmtRank(c.ranking)}</div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Ranking</div>
                      </div>
                      <div>
                        <div className="text-lg font-black text-[#08162d]">{c.averagePackage || "—"}</div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Avg Pkg</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Print-only header ───────────────────────────────────── */}
      <style>{`
        @media print {
          .hero-bg, .no-print { display: none !important; }
          body { background: white !important; }
          .space-y-6 > * { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default CompareColleges;

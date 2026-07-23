import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { getColleges } from "../lib/api";
import CollegeCard from "../components/colleges/CollegeCard";
import Pagination from "../components/ui/Pagination";

const CollegeList = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    course: searchParams.get("course") || "",
    stream: searchParams.get("stream") || "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
    collegeType: searchParams.get("collegeType") || "",
    maxFees: searchParams.get("maxFees") || "",
    sort: "rating",
    page: 1,
  });

  // Sync URL search params
  useEffect(() => {
    const q = searchParams.get("search");
    const crs = searchParams.get("course");
    const st = searchParams.get("stream");
    const sta = searchParams.get("state");
    const cty = searchParams.get("city");
    const ct = searchParams.get("collegeType");
    const mf = searchParams.get("maxFees");

    setFilters((prev) => ({
      ...prev,
      search: q !== null ? q : prev.search,
      course: crs !== null ? crs : prev.course,
      stream: st !== null ? st : prev.stream,
      state: sta !== null ? sta : prev.state,
      city: cty !== null ? cty : prev.city,
      collegeType: ct !== null ? ct : prev.collegeType,
      maxFees: mf !== null ? mf : prev.maxFees,
      page: 1
    }));
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["colleges", filters],
    queryFn: () => getColleges(filters),
  });

  const colleges = data?.items || [];
  const page = data?.page || 1;
  const pages = data?.pages || 1;

  const updateFilter = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value, page: 1 }));
  };

  const filterSummary = useMemo(() => {
    const parts = [];
    if (filters.stream) parts.push(filters.stream);
    if (filters.state) parts.push(filters.state);
    if (filters.city) parts.push(filters.city);
    if (filters.collegeType) parts.push(filters.collegeType);
    return parts.join(" • ") || "All categories & locations";
  }, [filters]);

  const inputCls =
    "rounded-xl border border-slate-200 px-4 py-2.5 w-full bg-slate-50 text-sm focus:outline-none focus:border-amber transition-colors font-medium";

  return (
    <div className="space-y-8 px-6 md:px-10 py-8 max-w-7xl mx-auto">

      {/* ── Hero banner ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#08162d] to-[#0f2343] relative text-white py-12 px-8 rounded-3xl overflow-hidden shadow-xl flex items-center justify-between gap-6 flex-wrap">
        <div className="space-y-2 max-w-xl">
          <span className="bg-[rgba(226,138,0,0.2)] text-[#e28a00] border border-[rgba(226,138,0,0.3)] text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full inline-block">
            Module 4 &amp; 7 • Advanced Directory
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            Explore &amp; Filter Top Universities
          </h1>
          <p className="text-sm text-white/70 font-medium leading-relaxed">
            Filter by fee budgets, rankings, cities, ownership types, and streams to acquire real verified placement insights.
          </p>
        </div>
        <Link to="/compare" className="bg-[#e28a00] hover:bg-[#c67900] text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg flex items-center gap-2">
          ⚖️ Compare Colleges Side-by-Side
        </Link>
      </section>

      {/* ── Advanced Filters Panel ─────────────────────────────────── */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="space-y-1 lg:col-span-2">
          <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Search College Name / Course</label>
          <input className={inputCls} placeholder="Type college name…" value={filters.search} onChange={updateFilter("search")} />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Stream</label>
          <select className={`${inputCls} bg-white`} value={filters.stream} onChange={updateFilter("stream")}>
            <option value="">All Streams</option>
            <option value="Engineering">Engineering</option>
            <option value="Management">Management</option>
            <option value="Medical">Medical</option>
            <option value="Commerce">Commerce</option>
            <option value="Science">Science</option>
            <option value="Arts">Arts</option>
            <option value="Design">Design</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Law">Law</option>
            <option value="Computer Applications">Computer Applications</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">State / Location</label>
          <input className={inputCls} placeholder="e.g. Delhi, Maharashtra" value={filters.state} onChange={updateFilter("state")} />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">College Type</label>
          <select className={`${inputCls} bg-white`} value={filters.collegeType} onChange={updateFilter("collegeType")}>
            <option value="">All Types</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
            <option value="Deemed">Deemed</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Sort By</label>
          <select className={`${inputCls} bg-white`} value={filters.sort} onChange={updateFilter("sort")}>
            <option value="rating">🏆 Highest Rated</option>
            <option value="fees">💰 Lowest Fees</option>
            <option value="ranking">⭐ Best Ranking</option>
          </select>
        </div>
      </section>

      {/* ── Count + Pagination header ─────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-[#08162d]">
            {isLoading ? "Loading…" : `${data?.total ?? 0} Genuine Colleges Found`}
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
            📍 {filterSummary}
          </p>
        </div>
        <Pagination
          page={page}
          pages={pages}
          onPageChange={(next) => setFilters((prev) => ({ ...prev, page: next }))}
        />
      </div>

      {/* ── Loading spinner ───────────────────────────────────── */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[250px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e28a00]" />
        </div>
      )}

      {/* ── College cards ─────────────────────────────────────── */}
      {!isLoading && colleges.length > 0 && (
        <div className="flex flex-col gap-5 w-full">
          {colleges.map((college) => (
            <CollegeCard key={college._id} college={college} variant="row" />
          ))}
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────── */}
      {!isLoading && colleges.length === 0 && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 shadow-card space-y-4">
          <span className="text-5xl block">🔍</span>
          <h3 className="text-lg font-black text-[#08162d]">No Colleges Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            We couldn't find any active colleges matching your advanced filters. Try resetting filters.
          </p>
          <button
            onClick={() => setFilters({ search: "", stream: "", state: "", city: "", collegeType: "", maxFees: "", sort: "rating", page: 1 })}
            className="bg-[#e28a00] hover:bg-[#c67900] text-white font-extrabold text-xs px-6 py-2.5 rounded-full transition-all shadow-lg"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* ── Bottom pagination ─────────────────────────────────── */}
      {!isLoading && pages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            page={page}
            pages={pages}
            onPageChange={(next) => setFilters((prev) => ({ ...prev, page: next }))}
          />
        </div>
      )}
    </div>
  );
};

export default CollegeList;

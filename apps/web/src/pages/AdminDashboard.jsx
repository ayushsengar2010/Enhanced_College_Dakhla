import { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, AreaChart, Area,
} from "recharts";
import { getDashboard, downloadAnalyticsCSV } from "../lib/api";
import StatCard from "../components/ui/StatCard";
import ChartCard from "../components/ui/ChartCard";
import { Icon } from "../components/ui/Icons";
import useSocket from "../hooks/useSocket";

/* ───────── helper functions ───────── */

const monthName = (m) =>
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][(m || 1) - 1];

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

/* ───────── color palette ───────── */
const GOLD = "#c07e3e";
const GOLD_LIGHT = "#d6ab7b";
const GOLD_PALE = "#e6cbab";
const TEAL = "#0d9488";
const ROSE = "#e11d48";
const INDIGO = "#4f46e5";
const EMERALD = "#059669";
const AMBER = "#d97706";
const SKY = "#0284c7";
const SLATE = "#64748b";

const STATUS_COLORS = {
  "New": "#3b82f6",
  "Contacted": "#f59e0b",
  "Interested": "#8b5cf6",
  "Admission Done": "#10b981",
  "Not Interested": "#ef4444",
  "Sent": "#06b6d4",
  "Failed": "#dc2626",
};

const SOURCE_COLORS_MAP = {
  "home_page": "#c07e3e",
  "college_detail": "#0d9488",
  "contact_page": "#4f46e5",
  "college_predictor": "#d97706",
};

const CHART_COLORS = [GOLD, TEAL, INDIGO, ROSE, EMERALD, AMBER, SKY, SLATE];

/* ───────── StatCardSkeleton ───────── */
const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[120px] animate-pulse">
    <div className="h-8 w-20 bg-slate-200 rounded mb-3" />
    <div className="h-4 w-32 bg-slate-100 rounded" />
  </div>
);

/* ───────── Tiny Sparkline cell ───────── */
const SparkCell = ({ trend }) => {
  const up = trend > 0;
  const color = up ? EMERALD : trend < 0 ? ROSE : SLATE;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color }}>
      {trend !== 0 && (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
          {up
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          }
        </svg>
      )}
      {Math.abs(trend).toFixed(1)}%
    </span>
  );
};

/* ════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [period, setPeriod] = useState("12m");
  const [lastRefresh, setLastRefresh] = useState(null);
  const queryClient = useQueryClient();

  const params = {};
  if (period === "1m") {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    params.startDate = d.toISOString();
  } else if (period === "6m") {
    const d = new Date(); d.setMonth(d.getMonth() - 6);
    params.startDate = d.toISOString();
  } else if (period === "30d") {
    const d = new Date(); d.setDate(d.getDate() - 30);
    params.startDate = d.toISOString();
  }

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["dashboard", period],
    queryFn: () => getDashboard(params),
  });

  /* ── Real-time updates via WebSocket ──────────────────────── */
  const handleDashboardUpdate = useCallback(() => {
    queryClient.invalidateQueries(["dashboard", period]);
    setLastRefresh(new Date());
  }, [queryClient, period]);

  const { isConnected } = useSocket({ onDashboardUpdate: handleDashboardUpdate });

  // Auto-refresh every 60s as a fallback
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries(["dashboard", period]);
    }, 60000);
    return () => clearInterval(interval);
  }, [queryClient, period]);

  const totals = data?.totals || {};
  const trends = data?.trends || {};
  const breakdowns = data?.breakdowns || {};
  const recentLeads = data?.recentLeads || [];
  const topColleges = data?.topColleges || [];

  /* ── Transform lead trends ── */
  const leadTrendData = (trends?.monthlyLeads || []).map((m) => ({
    name: `${monthName(m._id.month)} ${String(m._id.year).slice(2)}`,
    Enquiries: m.total,
  }));

  /* ── Transform blog trends ── */
  const blogTrendData = (trends?.blogTrends || []).map((m) => ({
    name: `${monthName(m._id.month)} ${String(m._id.year).slice(2)}`,
    Posts: m.total,
  }));

  /* ── Status breakdown ── */
  const statusPie = (breakdowns?.leadStatus || []).map((s) => ({
    name: s._id || "Unknown",
    value: s.count,
    color: STATUS_COLORS[s._id] || SLATE,
  }));

  /* ── Source breakdown ── */
  const sourcePie = (breakdowns?.leadSource || []).map((s) => ({
    name: s._id || "Unknown",
    value: s.count,
    color: SOURCE_COLORS_MAP[s._id] || SLATE,
  }));

  /* ── College type ── */
  const typePie = (breakdowns?.collegeType || []).map((s, i) => ({
    name: s._id || "Other",
    value: s.count,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  /* ── CSV Export ── */
  const handleExport = useCallback(async (type) => {
    const labels = { leads: "Leads", colleges: "Colleges", blogs: "Blogs" };
    const filename = `${type}_report_${new Date().toISOString().split("T")[0]}.csv`;
    try {
      await downloadAnalyticsCSV(type, filename);
    } catch {
      alert("Export failed. Please try again.");
    }
  }, []);

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card p-6 animate-pulse"><div className="h-64 bg-slate-100 rounded-lg" /></div>
          <div className="card p-6 animate-pulse"><div className="h-64 bg-slate-100 rounded-lg" /></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-700">Failed to load dashboard</h2>
        <p className="text-sm text-slate-500 max-w-md text-center">{error?.message || "Something went wrong"}</p>
        <button onClick={() => refetch()} className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            {/* Connection indicator */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                isConnected
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}
              title={isConnected ? "Live updates active" : "Live updates unavailable — refreshing every 60s"}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
              {isConnected ? "LIVE" : "60s poll"}
            </span>
            {isRefetching && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                updating...
              </span>
            )}
            {lastRefresh && (
              <span className="text-[10px] text-slate-400 font-medium">
                Updated {new Date(lastRefresh).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Overview of your platform performance
            {data?.totals?.totalLeads !== undefined && (
              <span className="ml-2 text-slate-400">· {totals.totalLeads} total enquiries</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period filter */}
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {[
              { key: "30d", label: "30D" },
              { key: "1m", label: "1M" },
              { key: "6m", label: "6M" },
              { key: "12m", label: "1Y" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setPeriod(opt.key)}
                className={`px-3.5 py-2 text-xs font-semibold transition-colors ${
                  period === opt.key
                    ? "bg-gold text-white"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* CSV Export dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:border-gold hover:text-gold transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 overflow-hidden">
              {[
                { type: "leads", label: "Export Leads" },
                { type: "colleges", label: "Export Colleges" },
                { type: "blogs", label: "Export Blogs" },
              ].map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => handleExport(opt.type)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-gold transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Colleges" value={totals.activeColleges ?? "—"} icon="🏛️" to="/admin/colleges" />
        <StatCard label="Total Courses" value={totals.totalCourses ?? "—"} icon="📖" to="/admin/courses" />
        <StatCard label="Total Blogs" value={totals.totalBlogs ?? "—"} icon="📰" to="/admin/blogs" />
        <StatCard label="Testimonials" value={totals.totalTestimonials ?? "—"} icon="💬" to="/admin/testimonials" />

        <StatCard label="Total Enquiries" value={totals.totalLeads ?? "—"} icon="🎯" to="/admin/leads" />
        <StatCard label="Contacted / Interested" value={totals.contactedLeads ?? "—"} icon="📞" to="/admin/leads" />
        <StatCard label="Admissions Done" value={totals.admissionDoneLeads ?? "—"} icon="✅" to="/admin/leads" />
        <StatCard label="Pending Reviews" value={totals.pendingReviews ?? "—"} icon="⏳" to="/admin/reviews" />
      </div>

      {/* ── Secondary stats row ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {[
          { label: "Exams", value: totals.totalExams },
          { label: "Scholarships", value: totals.totalScholarships },
          { label: "Study Materials", value: totals.totalStudyMaterials },
          { label: "Q&A Questions", value: totals.totalQuestions },
          { label: "Alert Subscribers", value: totals.totalSubscribers },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 px-4 py-3 text-center shadow-sm">
            <div className="text-xl font-bold text-slate-700">{s.value ?? "—"}</div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
        <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 text-center shadow-sm">
          <div className="text-xl font-bold text-slate-700">{totals.totalApis ?? "—"}</div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">API Integrations</div>
        </div>
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Lead Trends Bar Chart */}
        <ChartCard title={<><Icon name="chart" className="inline-block w-5 h-5 mr-2 text-gold" />Monthly Enquiries</>}>
          {leadTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={leadTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  labelStyle={{ fontWeight: 600, color: "#334155" }}
                />
                <Bar dataKey="Enquiries" fill={GOLD} radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">No enquiry data for this period.</div>
          )}
        </ChartCard>

        {/* Blog Trends Area Chart */}
        <ChartCard title={<><Icon name="blog" className="inline-block w-5 h-5 mr-2 text-teal-600" />Blog Posts Published</>}>
          {blogTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={blogTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="blogGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  labelStyle={{ fontWeight: 600, color: "#334155" }}
                />
                <Area type="monotone" dataKey="Posts" stroke={TEAL} strokeWidth={2} fill="url(#blogGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">No blog data for this period.</div>
          )}
        </ChartCard>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Lead Status Pie */}
        <ChartCard title={<><Icon name="pie" className="inline-block w-5 h-5 mr-2 text-rose-500" />Lead Status</>}>
          {statusPie.length > 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {statusPie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-1">
                {statusPie.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name} ({s.value})
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">No status data.</div>
          )}
        </ChartCard>

        {/* Source Breakdown Pie */}
        <ChartCard title={<><Icon name="pie" className="inline-block w-5 h-5 mr-2 text-indigo-500" />Lead Sources</>}>
          {sourcePie.length > 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourcePie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {sourcePie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-1">
                {sourcePie.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} ({s.value})
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">No source data.</div>
          )}
        </ChartCard>

        {/* College Type Distribution */}
        <ChartCard title={<><Icon name="pie" className="inline-block w-5 h-5 mr-2 text-emerald-500" />College Types</>}>
          {typePie.length > 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typePie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {typePie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-1">
                {typePie.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name} ({s.value})
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">No college type data.</div>
          )}
        </ChartCard>
      </div>

      {/* ── Bottom Row: Recent Leads + Top Colleges ── */}
      <div className="grid gap-8 lg:grid-cols-2">

        {/* Recent Leads Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">
              <Icon name="activity" className="inline-block w-5 h-5 mr-2 text-gold" />
              Recent Enquiries
            </h3>
            <a href="/admin/leads" className="text-xs font-semibold text-gold hover:text-gold/80 transition-colors">
              View all →
            </a>
          </div>

          {recentLeads.length > 0 ? (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Source</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-medium text-slate-700">{lead.name}</div>
                        <div className="text-xs text-slate-400">{lead.email || lead.phone}</div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                          {(lead.source || "direct").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold"
                          style={{
                            backgroundColor: `${STATUS_COLORS[lead.status] || SLATE}18`,
                            color: STATUS_COLORS[lead.status] || SLATE,
                          }}
                        >
                          {lead.status || "New"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="text-slate-500 text-xs">{formatDate(lead.createdAt)}</span>
                        <br />
                        <span className="text-slate-400 text-[11px]">{formatTime(lead.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
              No recent enquiries
            </div>
          )}
        </div>

        {/* Top Colleges */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">
              <Icon name="star" className="inline-block w-5 h-5 mr-2 text-gold" />
              Top Rated Colleges
            </h3>
            <a href="/admin/colleges" className="text-xs font-semibold text-gold hover:text-gold/80 transition-colors">
              View all →
            </a>
          </div>

          {topColleges.length > 0 ? (
            <div className="space-y-3">
              {topColleges.map((college, idx) => (
                <div
                  key={college._id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  {/* Rank badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    idx === 0 ? "bg-amber-50 text-amber-600" :
                    idx === 1 ? "bg-slate-100 text-slate-500" :
                    idx === 2 ? "bg-orange-50 text-orange-600" :
                    "bg-slate-50 text-slate-400"
                  }`}>
                    #{idx + 1}
                  </div>

                  {/* College info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-700 truncate group-hover:text-gold transition-colors">
                      {college.collegeName || college.shortName}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {[college.city, college.state].filter(Boolean).join(", ")}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {college.rating || "—"}
                    </div>
                    {college.fees && (
                      <div className="text-[11px] text-slate-400">₹{college.fees.toLocaleString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
              No colleges yet
            </div>
          )}
        </div>
      </div>

      {/* ── Footer summary ── */}
      <div className="text-center text-xs text-slate-400 py-4 border-t border-slate-100">
        <span className="font-medium text-slate-500">{totals.totalColleges ?? 0}</span> colleges ·{" "}
        <span className="font-medium text-slate-500">{totals.totalCourses ?? 0}</span> courses ·{" "}
        <span className="font-medium text-slate-500">{totals.totalLeads ?? 0}</span> enquiries ·{" "}
        <span className="font-medium text-slate-500">{totals.totalBlogs ?? 0}</span> blogs
      </div>
    </div>
  );
};

export default AdminDashboard;

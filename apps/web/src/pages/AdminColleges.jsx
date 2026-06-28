import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { getColleges, deleteCollege } from "../lib/api";

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const AdminColleges = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-top-colleges", search, page, limit],
    queryFn: () => getColleges({ search: search || undefined, page, limit, status: "" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCollege(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-top-colleges"]);
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete college "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const colleges = data?.items || [];
  const total = data?.total !== undefined ? data.total : colleges.length;
  const pages = data?.pages || Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ≡ Top College
        </h1>
        <Link
          to="/admin/colleges/new"
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Add Colleges
        </Link>
      </div>

      {/* Table Container matching Screenshot 1 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="border border-slate-300 rounded-lg px-2 py-1 bg-white focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries per page</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="border border-slate-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:border-[#c58237]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-3">Sr.No. ↕</th>
                <th className="py-3.5 px-3">College Name ↕</th>
                <th className="py-3.5 px-3">Location ↕</th>
                <th className="py-3.5 px-3">Cutoff Exam ↕</th>
                <th className="py-3.5 px-3">Cutoff Score ↕</th>
                <th className="py-3.5 px-3">Application Start ↕</th>
                <th className="py-3.5 px-3">Application End ↕</th>
                <th className="py-3.5 px-3">Category ↕</th>
                <th className="py-3.5 px-3">User Reviews ↕</th>
                <th className="py-3.5 px-3">Rank ↕</th>
                <th className="py-3.5 px-3">Status ↕</th>
                <th className="py-3.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={12} className="text-center py-8 text-slate-400 font-bold">
                    Loading Colleges...
                  </td>
                </tr>
              ) : colleges.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-8 text-slate-400 font-bold">
                    No colleges found. Click "+ Add Colleges" to create one.
                  </td>
                </tr>
              ) : (
                colleges.map((col, index) => (
                  <tr key={col._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-3 font-black text-[#08162d] max-w-[200px]">{col.collegeName}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-600 max-w-[150px]">{col.location || `${col.city || ''}, ${col.state || ''}`}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{col.cutoffExam || "JEE Main / UPTAC"}</td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-[160px]">{col.cutoffScore || "JEE Main Rank ~ 5,15,000"}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-600">{col.applicationStart ? fmtDate(col.applicationStart) : "20 May 2026"}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-600">{col.applicationEnd ? fmtDate(col.applicationEnd) : "15 Aug 2026"}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{col.category || col.collegeType || "Private"}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-700">{col.userReviews || (col.rating ? `${col.rating}/5` : "3.9/5")}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-700 text-center">{col.rank || col.ranking || 10}</td>
                    <td className="py-3.5 px-3">
                      <span className={`font-black text-xs ${col.status === "Inactive" ? "text-rose-500" : "text-emerald-600"}`}>
                        {col.status || "Active"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/colleges/${col._id}`)}
                          title="Edit College"
                          className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(col._id, col.collegeName)}
                          title="Delete College"
                          className="w-7 h-7 rounded border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination matching Screenshot 1 */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500 font-semibold">
          <div>
            Showing {total > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              «
            </button>
            <button onClick={() => setPage(1)} className={`px-3 py-1 rounded font-bold ${page === 1 ? "bg-[#c58237] text-white" : "border border-slate-300 hover:bg-slate-100 text-slate-700"}`}>1</button>
            <button onClick={() => setPage(2)} className={`px-3 py-1 rounded font-bold ${page === 2 ? "bg-[#c58237] text-white" : "border border-slate-300 hover:bg-slate-100 text-slate-700"}`}>2</button>
            <button onClick={() => setPage(3)} className={`px-3 py-1 rounded font-bold ${page === 3 ? "bg-[#c58237] text-white" : "border border-slate-300 hover:bg-slate-100 text-slate-700"}`}>3</button>
            <button onClick={() => setPage(4)} className={`px-3 py-1 rounded font-bold ${page === 4 ? "bg-[#c58237] text-white" : "border border-slate-300 hover:bg-slate-100 text-slate-700"}`}>4</button>
            <button onClick={() => setPage(5)} className={`px-3 py-1 rounded font-bold ${page === 5 ? "bg-[#c58237] text-white" : "border border-slate-300 hover:bg-slate-100 text-slate-700"}`}>5</button>
            <span>...</span>
            <button onClick={() => setPage(pages)} className="px-3 py-1 rounded font-bold border border-slate-300 hover:bg-slate-100 text-slate-700">{pages}</button>
            <button
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminColleges;

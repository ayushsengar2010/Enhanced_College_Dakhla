import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getScholarships, createScholarship, updateScholarship, deleteScholarship } from "../lib/api";
import RichTextEditor from "../components/ui/RichTextEditor";

const TYPES = ["Merit", "Need-based", "Sports", "Minority", "State", "Central", "Olympiad", "Other"];

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toISOString().split("T")[0];
};

const AdminScholarships = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    type: "Merit",
    amount: "",
    eligibility: "",
    description: "",
    officialLink: "",
    lastDate: "",
    isActive: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-scholarships", search, page, limit],
    queryFn: () => getScholarships({ search: search || undefined, page, limit }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => (editingId ? updateScholarship(editingId, payload) : createScholarship(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-scholarships"]);
      setModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      alert("Failed to save scholarship: " + (err.response?.data?.message || err.message));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteScholarship(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-scholarships"]);
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      provider: "",
      type: "Merit",
      amount: "",
      eligibility: "",
      description: "",
      officialLink: "",
      lastDate: "",
      isActive: true,
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (sch) => {
    setEditingId(sch._id);
    setFormData({
      name: sch.name || "",
      provider: sch.provider || "",
      type: sch.type || "Merit",
      amount: sch.amount || "",
      eligibility: sch.eligibility || "",
      description: sch.description || "",
      officialLink: sch.officialLink || "",
      lastDate: sch.lastDate ? fmtDate(sch.lastDate) : "",
      isActive: sch.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete scholarship "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      lastDate: formData.lastDate || null,
    });
  };

  const scholarships = data?.items || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          🎓 Scholarships &amp; Fellowships Management
        </h1>
        <button
          onClick={handleOpenCreate}
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Add Scholarship
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls */}
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
                <th className="py-3.5 px-4">Sr.No.</th>
                <th className="py-3.5 px-4">Scholarship Name</th>
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Last Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 font-bold">
                    Loading Scholarships...
                  </td>
                </tr>
              ) : scholarships.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 font-bold">
                    No scholarships found. Click "+ Add Scholarship" to create one.
                  </td>
                </tr>
              ) : (
                scholarships.map((sch, index) => (
                  <tr key={sch._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-4 font-black text-[#08162d] max-w-[220px]">{sch.name}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-600">{sch.provider}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-amber-50 text-[#e28a00] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                        {sch.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">{sch.amount || "—"}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{fmtDate(sch.lastDate)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-black text-xs ${sch.isActive !== false ? "text-emerald-600" : "text-rose-500"}`}>
                        {sch.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(sch)}
                          title="Edit Scholarship"
                          className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(sch._id, sch.name)}
                          title="Delete Scholarship"
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

        {/* Footer Pagination */}
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
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded font-bold ${page === i + 1 ? "bg-[#c58237] text-white" : "border border-slate-300 hover:bg-slate-100 text-slate-700"}`}
              >
                {i + 1}
              </button>
            ))}
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

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <h2 className="text-lg font-black text-[#08162d]">
              {editingId ? "Edit Scholarship Program" : "Add New Scholarship Program"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Scholarship Program Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="e.g. Reliance Foundation Undergraduate Scholarship"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Provider / Foundation *</label>
                  <input
                    required
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                    placeholder="e.g. Reliance Foundation"
                  />
                </div>
                <div>
                  <label className="block mb-1">Scholarship Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#c58237]"
                  >
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Grant / Scholarship Amount</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                    placeholder="e.g. ₹2,00,000 Total"
                  />
                </div>
                <div>
                  <label className="block mb-1">Application Last Date</label>
                  <input
                    type="date"
                    value={formData.lastDate}
                    onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="e.g. 1st year B.Tech students with annual family income < 15 LPA"
                />
              </div>
              <div>
                <label className="block mb-1">Description &amp; Overview</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                  placeholder="Details regarding fellowship goals, evaluation phases, and selection interview process..."
                />
              </div>
              <div>
                <label className="block mb-1">Official Portal Link</label>
                <input
                  type="url"
                  value={formData.officialLink}
                  onChange={(e) => setFormData({ ...formData, officialLink: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="https://scholarships.gov.in"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveSch"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="accent-[#c58237] w-4 h-4"
                />
                <label htmlFor="isActiveSch" className="cursor-pointer">Active &amp; Visible on Website</label>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isLoading}
                  className="px-5 py-2 rounded-xl bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold shadow-md"
                >
                  {saveMutation.isLoading ? "Saving..." : editingId ? "Update Scholarship" : "Create Scholarship"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScholarships;

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAlerts, createAlert, updateAlert, deleteAlert } from "../lib/api";

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toISOString().split("T")[0];
};

const AdminAlerts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "Exam",
    body: "",
    link: "",
    deadline: "",
    isActive: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-alerts", search, page, limit],
    queryFn: () => getAlerts({ search: search || undefined, page, limit }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => (editingId ? updateAlert(editingId, payload) : createAlert(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-alerts"]);
      setModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      alert("Failed to save alert: " + (err.response?.data?.message || err.message));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-alerts"]);
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", type: "Exam", body: "", link: "", deadline: "", isActive: true });
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (alert) => {
    setEditingId(alert._id);
    setFormData({
      title: alert.title || "",
      type: alert.type || "Exam",
      body: alert.body || "",
      link: alert.link || "",
      deadline: alert.deadline ? fmtDate(alert.deadline) : "",
      isActive: alert.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete admission alert "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      deadline: formData.deadline || null,
    });
  };

  const alerts = data?.items || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          🔔 Admission &amp; Exam Alerts
        </h1>
        <button
          onClick={handleOpenCreate}
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Add New Alert
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
                <th className="py-3.5 px-4">Alert Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Link</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 font-bold">
                    Loading Alerts...
                  </td>
                </tr>
              ) : alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 font-bold">
                    No admission alerts found. Click "+ Add New Alert" to create one.
                  </td>
                </tr>
              ) : (
                alerts.map((alert, index) => (
                  <tr key={alert._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-4 font-black text-[#08162d]">{alert.title}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-amber-50 text-[#e28a00] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                        {alert.type || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{fmtDate(alert.deadline)}</td>
                    <td className="py-3.5 px-4 text-blue-600 truncate max-w-[180px]">
                      {alert.link ? (
                        <a href={alert.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {alert.link}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-black text-xs ${alert.isActive !== false ? "text-emerald-600" : "text-rose-500"}`}>
                        {alert.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(alert)}
                          title="Edit Alert"
                          className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(alert._id, alert.title)}
                          title="Delete Alert"
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <h2 className="text-lg font-black text-[#08162d]">
              {editingId ? "Edit Admission Alert" : "Add New Admission Alert"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Alert Title *</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="e.g. JEE Main Session 2 Admit Card Released"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Alert Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#c58237]"
                  >
                    <option value="Exam">Exam</option>
                    <option value="Admission">Admission</option>
                    <option value="Result">Result</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1">Alert Description / Body</label>
                <textarea
                  rows={3}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="Details regarding registration guidelines, documents required, etc..."
                />
              </div>
              <div>
                <label className="block mb-1">Action Link / URL</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="https://jeemain.nta.ac.in"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="accent-[#c58237] w-4 h-4"
                />
                <label htmlFor="isActive" className="cursor-pointer">Active &amp; Visible on Website</label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold shadow-md"
                >
                  {saveMutation.isLoading ? "Saving..." : editingId ? "Update Alert" : "Create Alert"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAlerts;

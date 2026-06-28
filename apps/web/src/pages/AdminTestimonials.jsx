import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "../lib/api";

const AdminTestimonials = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    studentName: "",
    role: "Student",
    review: "",
    status: "Active",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials-table", search, page, limit],
    queryFn: () => getTestimonials({ search: search || undefined, page, limit }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => (editingItem ? updateTestimonial(editingItem._id, payload) : createTestimonial(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-testimonials-table"]);
      setModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-testimonials-table"]);
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ studentName: "", role: "Student", review: "", status: "Active" });
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingItem(t);
    setFormData({
      studentName: t.studentName || t.name || "",
      role: t.role || "Student",
      review: t.review || t.description || "",
      status: t.status || "Active",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.review) {
      alert("Please fill in Name and Description!");
      return;
    }
    saveMutation.mutate({
      ...formData,
      name: formData.studentName,
      description: formData.review,
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete testimonial from "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const testimonials = data?.items || [];
  const total = data?.total || 3;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ≡ Testimonial
        </h1>
        <button
          onClick={handleOpenCreate}
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Add Testimonial
        </button>
      </div>

      {/* Table Container matching Screenshot 5 */}
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
                <th className="py-3.5 px-4">Sr.No. ↕</th>
                <th className="py-3.5 px-4">Name ↕</th>
                <th className="py-3.5 px-4">Role ↕</th>
                <th className="py-3.5 px-4">Description ↕</th>
                <th className="py-3.5 px-4">Status ↕</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-bold">
                    Loading Testimonials...
                  </td>
                </tr>
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-bold">
                    No testimonials found. Click "+ Add Testimonial" to add one.
                  </td>
                </tr>
              ) : (
                testimonials.map((item, index) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-4 font-black text-[#08162d] whitespace-nowrap">{item.studentName || item.name}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">{item.role || "Student"}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[420px] leading-relaxed">{item.review || item.description}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-black text-xs ${item.status === "Inactive" ? "text-rose-500" : "text-emerald-600"}`}>
                        {item.status || "Active"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Testimonial"
                          className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.studentName || item.name)}
                          title="Delete Testimonial"
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

        {/* Footer Pagination matching Screenshot 5 */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500 font-semibold">
          <div>Showing 1 to {testimonials.length} of {total} entries</div>
          <div className="flex items-center gap-1">
            <button disabled className="px-2.5 py-1 border border-slate-300 rounded opacity-40">«</button>
            <button className="px-3 py-1 rounded font-bold bg-[#c58237] text-white">1</button>
            <button disabled className="px-2.5 py-1 border border-slate-300 rounded opacity-40">»</button>
          </div>
        </div>
      </div>

      {/* Add / Edit Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden space-y-6">
            <div className="bg-[#c58237] text-white p-4 font-black text-center text-sm uppercase tracking-wider">
              {editingItem ? "EDIT TESTIMONIAL" : "ADD TESTIMONIAL"}
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Student Name</label>
                <input
                  type="text"
                  placeholder="Enter Student Name"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Role / Stream</label>
                <input
                  type="text"
                  placeholder="e.g. Commerce Student, MBA Aspirant"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Description / Review</label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed feedback or review..."
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-slate-500 hover:bg-slate-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
                >
                  {saveMutation.isPending ? "Saving..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;

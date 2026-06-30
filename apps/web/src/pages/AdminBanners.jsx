import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../lib/api";

const AdminBanners = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    link: "",
    description: "",
    isActive: true,
    order: 0,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-banners", search, page, limit],
    queryFn: () => getBanners({ search: search || undefined, page, limit }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editingItem ? updateBanner(editingItem._id, payload) : createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-banners"]);
      setModalOpen(false);
      setEditingItem(null);
    },
    onError: (err) => {
      alert("Failed to save banner: " + (err.response?.data?.message || err.message));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-banners"]);
    },
  });

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ title: "", imageUrl: "", link: "", description: "", isActive: true, order: 0 });
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingItem(b);
    setFormData({
      title: b.title || "",
      imageUrl: b.imageUrl || "",
      link: b.link || "",
      description: b.description || "",
      isActive: b.isActive !== false,
      order: b.order || 0,
    });
    setModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete banner "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      alert("Title and Image URL are required!");
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/uploads`,
        { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }, body: form }
      );
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        alert("Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    }
  };

  const banners = data?.items || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          🖼️ Home Page Banners
        </h1>
        <button
          onClick={handleOpenCreate}
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Add Banner
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
                <th className="py-3.5 px-4">Preview</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Link</th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 font-bold">
                    Loading Banners...
                  </td>
                </tr>
              ) : banners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 font-bold">
                    No banners found. Click "+ Add Banner" to add one.
                  </td>
                </tr>
              ) : (
                banners.map((b, index) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <img
                        src={b.imageUrl}
                        alt={b.title}
                        className="w-20 h-12 object-cover rounded-lg border border-slate-200 shadow-sm"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#08162d] max-w-[220px] truncate">
                      {b.title}
                    </td>
                    <td className="py-3.5 px-4 text-blue-600 truncate max-w-[160px]">
                      {b.link ? (
                        <a href={b.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {b.link}
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-600">{b.order}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-black text-xs ${
                          b.isActive !== false ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {b.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          title="Edit Banner"
                          className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(b._id, b.title)}
                          title="Delete Banner"
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
                className={`px-3 py-1 rounded font-bold ${
                  page === i + 1
                    ? "bg-[#c58237] text-white"
                    : "border border-slate-300 hover:bg-slate-100 text-slate-700"
                }`}
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setModalOpen(false); setEditingItem(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <h2 className="text-lg font-black text-[#08162d]">
              {editingItem ? "Edit Banner" : "Add New Home Page Banner"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              {/* Title */}
              <div>
                <label className="block mb-1">Banner Title *</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="e.g. IIT Bombay Campus"
                />
              </div>

              {/* Image URL + Upload */}
              <div>
                <label className="block mb-1">Banner Image *</label>
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                    placeholder="https://example.com/image.jpg"
                  />
                  <label className="shrink-0 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl px-3 py-2.5 cursor-pointer font-bold text-slate-600 transition-colors flex items-center gap-1">
                    📁
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                )}
              </div>

              {/* Link */}
              <div>
                <label className="block mb-1">Click Link (optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="https://collegedakhla.com/colleges"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1">Description (optional)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="Short description for this banner..."
                />
              </div>

              {/* Order + Active */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  />
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="accent-[#c58237] w-4 h-4"
                    />
                    <span>Active &amp; Visible</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setEditingItem(null); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold shadow-md"
                >
                  {saveMutation.isPending ? "Saving..." : editingItem ? "Update Banner" : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;

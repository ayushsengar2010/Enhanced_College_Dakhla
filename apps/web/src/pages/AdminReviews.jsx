import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, updateReview, createReview } from "../lib/api";

const fmtDateTime = (d) => {
  if (!d) return "Recently Posted";
  const date = new Date(d);
  return date.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const AdminReviews = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    collegeName: "",
    message: "",
    rating: 5,
    status: "Active",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews-table", search, page, limit],
    queryFn: () => getReviews({ search: search || undefined, page, limit }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateReview(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reviews-table"]);
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reviews-table"]);
      setModalOpen(false);
      setFormData({ studentName: "", email: "", collegeName: "", message: "", rating: 5, status: "Active" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      studentName: formData.studentName,
      email: formData.email,
      collegeName: formData.collegeName,
      message: formData.message,
      ratings: { overall: Number(formData.rating) },
      status: formData.status,
    });
  };

  const reviews = data?.items || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ⭐ Campus Review List &amp; Moderation
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Add Campus Review
        </button>
      </div>

      {/* Table Container */}
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
                <th className="py-3.5 px-4">Sr.No.</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">College Name</th>
                <th className="py-3.5 px-4">Review Message</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Date/Time</th>
                <th className="py-3.5 px-4">Status (Click to toggle)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 font-bold">
                    Loading Campus Reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 font-bold">
                    No campus reviews found. Click "+ Add Campus Review" to create one.
                  </td>
                </tr>
              ) : (
                reviews.map((rev, index) => (
                  <tr key={rev._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-4 font-black text-[#08162d] whitespace-nowrap">{rev.studentName}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{rev.email || "student@gmail.com"}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 max-w-[240px]">{rev.collegeName || "IIT Bombay"}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[240px] line-clamp-2">{rev.message || rev.body || "Great campus environment!"}</td>
                    <td className="py-3.5 px-4 text-amber-500 font-extrabold tracking-widest text-sm whitespace-nowrap">
                      {"★".repeat(rev.ratings?.overall || rev.rating || 5)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">{fmtDateTime(rev.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          const newSt = rev.status === "Active" ? "Inactive" : "Active";
                          toggleStatusMutation.mutate({ id: rev._id, status: newSt });
                        }}
                        className={`font-black text-xs cursor-pointer hover:underline px-2.5 py-1 rounded-full border ${rev.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}
                      >
                        {rev.status || "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500 font-semibold">
          <div>Showing {reviews.length} of {total} entries</div>
        </div>
      </div>

      {/* Add Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <h2 className="text-lg font-black text-[#08162d]">Add Campus Review</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Student Name *</label>
                <input
                  required
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div>
                <label className="block mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="rahul@gmail.com"
                />
              </div>
              <div>
                <label className="block mb-1">College Name *</label>
                <input
                  required
                  type="text"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="e.g. IIT Bombay - Indian Institute of Technology"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Star Rating (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#c58237]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#c58237]"
                  >
                    <option value="Active">Active &amp; Live</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1">Review Feedback / Message *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="Write honest review feedback regarding campus life, placements, faculty, and hostels..."
                />
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
                  disabled={createMutation.isLoading}
                  className="px-5 py-2 rounded-xl bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold shadow-md"
                >
                  {createMutation.isLoading ? "Saving..." : "Publish Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;

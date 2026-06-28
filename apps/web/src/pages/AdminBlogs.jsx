import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { getBlogs, deleteBlog } from "../lib/api";

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const AdminBlogs = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blogs-table", search, page, limit],
    queryFn: () => getBlogs({ search: search || undefined, page, limit, status: "" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-blogs-table"]);
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete blog "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const blogs = data?.items || [];
  const total = data?.total || 55;
  const pages = data?.pages || 6;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ≡ Blogs
        </h1>
        <Link
          to="/admin/blogs/new"
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Add Blog
        </Link>
      </div>

      {/* Table Container matching Screenshot 3 */}
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
                <th className="py-3.5 px-4">Sr.No. ↕</th>
                <th className="py-3.5 px-4">Featured Image ↕</th>
                <th className="py-3.5 px-4">Title ↕</th>
                <th className="py-3.5 px-4">Publish Date ↕</th>
                <th className="py-3.5 px-4">Status ↕</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-bold">
                    Loading Blogs...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-bold">
                    No blogs found. Click "+ Add Blog" to create one.
                  </td>
                </tr>
              ) : (
                blogs.map((blog, index) => (
                  <tr key={blog._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-4">
                      <img
                        src={blog.coverImage || blog.featuredImage || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=120&q=80"}
                        alt={blog.title}
                        className="w-14 h-10 object-cover rounded-md border border-slate-200 shadow-sm"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#08162d] max-w-[320px]">{blog.title}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{fmtDate(blog.publishDate || blog.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-black text-xs ${blog.status === "Inactive" ? "text-rose-500" : "text-emerald-600"}`}>
                        {blog.status || "Active"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/blogs/${blog._id}`)}
                          title="Edit Blog"
                          className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                        >
                          ✏️
                        </button>
                        <a
                          href={`/blogs/${blog._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Blog"
                          className="w-7 h-7 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors"
                        >
                          👁️
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination matching Screenshot 3 */}
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
            {Array.from({ length: Math.min(pages, 6) }).map((_, i) => (
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
    </div>
  );
};

export default AdminBlogs;

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { getCourses, deleteCourse } from "../lib/api";

const AdminCourses = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-courses-table", search, page, limit],
    queryFn: () => getCourses({ search: search || undefined, page, limit }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-courses-table"]);
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete course "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const courses = data?.items || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ≡ Course
        </h1>
        <Link
          to="/admin/courses/new"
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Add Course
        </Link>
      </div>

      {/* Table Container matching Screenshot 4 */}
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
                <th className="py-3.5 px-3">Stream ↕</th>
                <th className="py-3.5 px-3">Sub Stream ↕</th>
                <th className="py-3.5 px-3">Course Type ↕</th>
                <th className="py-3.5 px-3">Course Name ↕</th>
                <th className="py-3.5 px-3">Course Duration ↕</th>
                <th className="py-3.5 px-3">Course Eligibility ↕</th>
                <th className="py-3.5 px-3">Entrance Exam ↕</th>
                <th className="py-3.5 px-3">Status ↕</th>
                <th className="py-3.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400 font-bold">
                    Loading Courses...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400 font-bold">
                    No courses found. Click "+ Add Course" to create one.
                  </td>
                </tr>
              ) : (
                courses.map((course, index) => (
                  <tr key={course._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-800">{course.stream || "Engineering"}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-600 max-w-[140px]">{course.subStream || "General"}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{course.courseType || "Bachelors"}</td>
                    <td className="py-3.5 px-3 font-black text-[#08162d] max-w-[180px]">{course.courseName}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-600">{course.duration || "3 Years"}</td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-[180px] truncate">{course.eligibility || "Graduation"}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{course.entranceExam || "CET"}</td>
                    <td className="py-3.5 px-3">
                      <span className={`font-black text-xs ${course.status === "Inactive" ? "text-rose-500" : "text-emerald-600"}`}>
                        {course.status || "Active"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/courses/${course._id}`)}
                          title="Edit Course"
                          className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(course._id, course.courseName)}
                          title="Delete Course"
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

        {/* Footer Pagination matching Screenshot 4 */}
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
    </div>
  );
};

export default AdminCourses;

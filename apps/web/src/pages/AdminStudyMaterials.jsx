import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudyMaterials, createStudyMaterial, updateStudyMaterial, deleteStudyMaterial } from "../lib/api";
import RichTextEditor from "../components/ui/RichTextEditor";

const STREAMS = ["Engineering", "Management", "Medical", "Commerce", "Arts", "Other"];
const TYPES = ["Syllabus", "Notes", "Sample Paper", "Previous Year", "Ebook", "Video Link", "Other"];

const AdminStudyMaterials = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    examName: "",
    stream: "Engineering",
    type: "Syllabus",
    description: "",
    fileUrl: "",
    language: "English",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-study-materials", search, page, limit],
    queryFn: () => getStudyMaterials({ search: search || undefined, page, limit }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => (editingId ? updateStudyMaterial(editingId, payload) : createStudyMaterial(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-study-materials"]);
      setModalOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteStudyMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-study-materials"]);
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      subject: "",
      examName: "",
      stream: "Engineering",
      type: "Syllabus",
      description: "",
      fileUrl: "",
      language: "English",
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (mat) => {
    setEditingId(mat._id);
    setFormData({
      title: mat.title || "",
      subject: mat.subject || "",
      examName: mat.examName || "",
      stream: mat.stream || "Engineering",
      type: mat.type || "Syllabus",
      description: mat.description || "",
      fileUrl: mat.fileUrl || "",
      language: mat.language || "English",
    });
    setModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete study material "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const materials = data?.items || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          📚 Study Materials &amp; Syllabi Management
        </h1>
        <button
          onClick={handleOpenCreate}
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Upload Study Material
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
                <th className="py-3.5 px-4">Material Title</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Exam</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Downloads</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 font-bold">
                    Loading Study Materials...
                  </td>
                </tr>
              ) : materials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 font-bold">
                    No study materials found. Click "+ Upload Study Material" to create one.
                  </td>
                </tr>
              ) : (
                materials.map((mat, index) => (
                  <tr key={mat._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-4 font-black text-[#08162d] max-w-[220px]">{mat.title}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-600">{mat.subject}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{mat.examName || "—"}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-amber-50 text-[#e28a00] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                        {mat.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">⬇️ {mat.downloads || 0}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {mat.fileUrl && (
                          <a
                            href={mat.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View / Open External Link"
                            className="w-7 h-7 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors"
                          >
                            👁️
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenEdit(mat)}
                          title="Edit Study Material"
                          className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(mat._id, mat.title)}
                          title="Delete Study Material"
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
              {editingId ? "Edit Study Material" : "Upload New Study Material"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Material Title *</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="e.g. JEE Advanced 10-Year Chapterwise Solved Papers"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Subject *</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                    placeholder="e.g. Physics, Chemistry & Math"
                  />
                </div>
                <div>
                  <label className="block mb-1">Associated Exam</label>
                  <input
                    type="text"
                    value={formData.examName}
                    onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                    placeholder="e.g. JEE Advanced / NEET UG"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Academic Stream</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#c58237]"
                  >
                    {STREAMS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Material Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#c58237]"
                  >
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1">File URL / Download Link *</label>
                <input
                  required
                  type="url"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="https://jeeadv.ac.in/syllabus.pdf"
                />
              </div>
              <div>
                <label className="block mb-1">Description &amp; Overview</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                  placeholder="Complete chapterwise previous year question paper archive with detailed step-by-step solutions..."
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
                  disabled={saveMutation.isLoading}
                  className="px-5 py-2 rounded-xl bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold shadow-md"
                >
                  {saveMutation.isLoading ? "Saving..." : editingId ? "Update Material" : "Upload Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudyMaterials;

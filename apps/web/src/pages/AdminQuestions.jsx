import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuestions, createQuestion, addAnswer, deleteQuestion } from "../lib/api";

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const AdminQuestions = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [stream, setStream] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [expertAnswer, setExpertAnswer] = useState("");

  // Add question form state
  const [newQ, setNewQ] = useState({
    title: "",
    body: "",
    authorName: "Admin / Counsellor",
    authorEmail: "",
    stream: "Engineering",
    tags: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-questions-table", search, stream, page, limit],
    queryFn: () => getQuestions({ search: search || undefined, stream: stream || undefined, page, limit }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-questions-table"]);
    },
  });

  const handleAddQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!newQ.title || !newQ.authorName) {
      alert("Please enter title and author name!");
      return;
    }
    try {
      const payload = {
        ...newQ,
        tags: newQ.tags ? newQ.tags.split(",").map((t) => t.trim()) : [],
      };
      await createQuestion(payload);
      setShowAddModal(false);
      setNewQ({ title: "", body: "", authorName: "Admin / Counsellor", authorEmail: "", stream: "Engineering", tags: "" });
      queryClient.invalidateQueries(["admin-questions-table"]);
      alert("Question added successfully!");
    } catch (err) {
      console.error("Error creating question:", err);
      alert("Failed to create question: " + (err.response?.data?.message || err.message));
    }
  };

  const handlePostExpertAnswer = async (e) => {
    e.preventDefault();
    if (!expertAnswer.trim() || !selectedQuestion) return;
    try {
      await addAnswer(selectedQuestion._id, {
        body: expertAnswer,
        authorName: "College Dakhla Expert Advisor",
        isExpert: true,
      });
      setExpertAnswer("");
      alert("Expert Answer posted successfully!");
      queryClient.invalidateQueries(["admin-questions-table"]);
      // Update local modal question instance
      setSelectedQuestion((prev) => ({
        ...prev,
        answers: [...(prev.answers || []), { body: expertAnswer, authorName: "College Dakhla Expert Advisor", isExpert: true }],
      }));
    } catch (err) {
      console.error("Error posting answer:", err);
      alert("Failed to post answer.");
    }
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete question: "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const questions = data?.items || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ≡ Student Q&amp;A Community
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Add Question
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-4 flex-wrap">
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
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Stream:</span>
              <select
                value={stream}
                onChange={(e) => { setStream(e.target.value); setPage(1); }}
                className="border border-slate-300 rounded-lg px-3 py-1 bg-white focus:outline-none"
              >
                <option value="">All Streams</option>
                <option value="Engineering">Engineering</option>
                <option value="Management">Management</option>
                <option value="Medical">Medical</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search title..."
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
                <th className="py-3.5 px-4">Question Details ↕</th>
                <th className="py-3.5 px-4">Stream ↕</th>
                <th className="py-3.5 px-4">Asked By ↕</th>
                <th className="py-3.5 px-4">Answers ↕</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-bold">
                    Loading Community Questions...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-bold">
                    No questions found. Click "+ Add Question" to create one.
                  </td>
                </tr>
              ) : (
                questions.map((q, index) => (
                  <tr key={q._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-black text-[#08162d] line-clamp-2">{q.title}</div>
                      {q.body && <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{q.body}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold text-[10px]">
                        {q.stream || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {q.authorName || "Anonymous"}
                      <div className="text-[10px] text-slate-400 font-normal">{fmtDate(q.createdAt)}</div>
                    </td>
                    <td className="py-3.5 px-4 font-black">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${q.answers?.length > 0 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {q.answers?.length || 0} Answers
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedQuestion(q)}
                          title="Answer / View Question"
                          className="w-8 h-8 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors font-bold text-xs"
                        >
                          💬
                        </button>
                        <button
                          onClick={() => handleDelete(q._id, q.title)}
                          title="Delete Question"
                          className="w-8 h-8 rounded border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-colors font-bold text-xs"
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

      {/* ── MODAL: Answer / View Question Details ──────────────────────── */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedQuestion(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center transition-all"
            >
              ✕
            </button>

            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#08162d] text-[#c58237] text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full">
                  {selectedQuestion.stream || "General"}
                </span>
                <span className="text-xs text-slate-400 font-bold">• Asked by {selectedQuestion.authorName}</span>
              </div>
              <h2 className="text-xl font-black text-[#08162d] leading-snug">{selectedQuestion.title}</h2>
              {selectedQuestion.body && <p className="text-slate-600 text-xs leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">{selectedQuestion.body}</p>}
            </div>

            {/* Existing Answers */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Answers ({selectedQuestion.answers?.length || 0})</h3>
              {(!selectedQuestion.answers || selectedQuestion.answers.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No answers submitted yet. Be the first advisor to answer!</p>
              ) : (
                selectedQuestion.answers.map((ans, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-black text-[#08162d]">
                      <span>{ans.authorName}</span>
                      {ans.isExpert && <span className="bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full uppercase">Expert Advisor</span>}
                    </div>
                    <p className="text-slate-700">{ans.body}</p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Expert Answer Form */}
            <form onSubmit={handlePostExpertAnswer} className="space-y-3 pt-3 border-t border-slate-100">
              <label className="block text-xs font-black text-slate-800 uppercase">Write Expert Answer as Admin</label>
              <textarea
                rows="3"
                value={expertAnswer}
                onChange={(e) => setExpertAnswer(e.target.value)}
                placeholder="Type official guidance or expert admission advice here..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                required
              />
              <button
                type="submit"
                className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md"
              >
                Submit Official Answer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Add Question ────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 border border-slate-200 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-[#08162d]">Add New Question</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-800 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Question Title</label>
                <input
                  type="text"
                  placeholder="Enter Question Title"
                  value={newQ.title}
                  onChange={(e) => setNewQ({ ...newQ, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#c58237]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Description / Details</label>
                <textarea
                  rows="3"
                  placeholder="Add optional body context..."
                  value={newQ.body}
                  onChange={(e) => setNewQ({ ...newQ, body: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#c58237]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase mb-1">Asked By (Author)</label>
                  <input
                    type="text"
                    value={newQ.authorName}
                    onChange={(e) => setNewQ({ ...newQ, authorName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#c58237]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase mb-1">Stream</label>
                  <select
                    value={newQ.stream}
                    onChange={(e) => setNewQ({ ...newQ, stream: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#c58237]"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Management">Management</option>
                    <option value="Medical">Medical</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md"
              >
                Submit Question
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;

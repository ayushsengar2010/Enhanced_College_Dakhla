import { useState, useEffect } from "react";
import { api } from "../lib/api";

const CommunityPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streamFilter, setStreamFilter] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);

  // Ask Question Form
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    body: "",
    authorName: "",
    authorEmail: "",
    stream: "Engineering",
    tags: ""
  });

  // Active answer inputs keyed by question ID
  const [answerInputs, setAnswerInputs] = useState({});

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const url = streamFilter ? `/api/questions?stream=${streamFilter}` : "/api/questions";
      const res = await api.get(url);
      const dataArr = Array.isArray(res.data?.items) 
        ? res.data.items 
        : (Array.isArray(res.data) ? res.data : []);
      setQuestions(dataArr);
    } catch (err) {
      console.error("Error loading community questions:", err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [streamFilter]);

  const handleAskSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.title || !newQuestion.authorName) {
      alert("Please enter a question title and your name!");
      return;
    }
    try {
      const payload = {
        ...newQuestion,
        tags: newQuestion.tags ? newQuestion.tags.split(",").map(t => t.trim()) : []
      };
      await api.post("/api/questions", payload);
      setShowAskModal(false);
      setNewQuestion({ title: "", body: "", authorName: "", authorEmail: "", stream: "Engineering", tags: "" });
      fetchQuestions();
    } catch (err) {
      console.error("Error posting question:", err);
      alert("Failed to post question.");
    }
  };

  const handleUpvote = async (id) => {
    try {
      await api.post(`/api/questions/${id}/upvote`);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    const text = answerInputs[questionId];
    if (!text) return;
    try {
      await api.post(`/api/questions/${questionId}/answers`, {
        body: text,
        authorName: "Peer Contributor"
      });
      setAnswerInputs({ ...answerInputs, [questionId]: "" });
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Failed to submit answer.");
    }
  };

  const questionList = Array.isArray(questions) ? questions : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#08162d] to-[#0f2343] rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="bg-[rgba(226,138,0,0.2)] text-[#e28a00] border border-[rgba(226,138,0,0.3)] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
              Module 13 • Peer Community
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Student Q&amp;A Community Forum
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Ask admission questions, discuss cutoffs, and get verified answers from senior students, alumni, and education experts.
            </p>
          </div>
          <button onClick={() => setShowAskModal(true)} className="bg-[#e28a00] hover:bg-[#c67900] text-white font-extrabold py-4 px-8 rounded-2xl text-base shadow-2xl transition-all shrink-0">
            ❓ Ask Question
          </button>
        </div>

        {/* Filter Stream Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {["", "Engineering", "Management", "Medical", "Commerce", "Arts"].map((str) => (
            <button key={str} onClick={() => setStreamFilter(str)} className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${streamFilter === str ? "bg-[#08162d] text-[#e28a00] shadow-md" : "bg-white border border-slate-200 text-slate-600 hover:border-[#e28a00]"}`}>
              {str || "All Discussions"}
            </button>
          ))}
        </div>

        {/* Questions Feed */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold">Loading community discussions...</div>
        ) : questionList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 font-semibold">
            No questions asked in this topic yet. Be the first to ask!
          </div>
        ) : (
          <div className="space-y-6">
            {questionList.map((q) => (
              <div key={q._id} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-100 text-slate-600 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        {q.stream}
                      </span>
                      {Array.isArray(q.tags) && q.tags.map((t) => (
                        <span key={t} className="bg-amber-50 text-[#e28a00] font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-black text-[#08162d] leading-snug">{q.title}</h3>
                    {q.body && <p className="text-slate-600 text-sm leading-relaxed">{q.body}</p>}
                  </div>
                  <button onClick={() => handleUpvote(q._id)} className="flex flex-col items-center bg-slate-50 border border-slate-200 hover:border-[#e28a00] p-3 rounded-xl transition-all shrink-0">
                    <span className="text-lg">▲</span>
                    <span className="text-xs font-black text-slate-800">{q.upvotes || 0}</span>
                  </button>
                </div>

                <div className="text-xs font-semibold text-slate-400 flex items-center gap-4 border-t border-b border-slate-100 py-3">
                  <span>Asked by <strong>{q.authorName}</strong></span>
                  <span>•</span>
                  <span>{q.answers?.length || 0} Answers</span>
                  <span>•</span>
                  <span>{q.views || 1} Views</span>
                </div>

                {/* Answers list */}
                {Array.isArray(q.answers) && q.answers.length > 0 && (
                  <div className="space-y-3 pt-2 pl-4 border-l-2 border-[#e28a00]/30">
                    {q.answers.map((ans, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-xl p-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#08162d]">
                            {ans.authorName} {ans.isExpert && <span className="bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full uppercase ml-1">Expert Advisor</span>}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{ans.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Answer Box */}
                <div className="pt-2 flex items-center gap-3">
                  <input type="text" placeholder="Write your answer..." value={answerInputs[q._id] || ""} onChange={(e) => setAnswerInputs({ ...answerInputs, [q._id]: e.target.value })} className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#e28a00]" />
                  <button onClick={() => handleAnswerSubmit(q._id)} className="bg-[#08162d] hover:bg-[#0f2343] text-[#e28a00] font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shrink-0">
                    Post Answer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for asking question */}
        {showAskModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 border border-slate-200 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-[#08162d]">Ask Community Question</h3>
                <button onClick={() => setShowAskModal(false)} className="text-slate-400 hover:text-slate-800 font-bold">✕</button>
              </div>
              <form onSubmit={handleAskSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Your Question Title</label>
                  <input type="text" placeholder="e.g. Is 85 percentile enough for NIT Trichy?" value={newQuestion.title} onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold" required />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Detailed Description</label>
                  <textarea rows="3" placeholder="Add additional details about your rank, category, or branch preference..." value={newQuestion.body} onChange={(e) => setNewQuestion({ ...newQuestion, body: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Your Name</label>
                    <input type="text" placeholder="John Doe" value={newQuestion.authorName} onChange={(e) => setNewQuestion({ ...newQuestion, authorName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold" required />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Stream</label>
                    <select value={newQuestion.stream} onChange={(e) => setNewQuestion({ ...newQuestion, stream: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold">
                      <option value="Engineering">Engineering</option>
                      <option value="Management">Management</option>
                      <option value="Medical">Medical</option>
                      <option value="Commerce">Commerce</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#e28a00] hover:bg-[#c67900] text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-lg">
                  Submit Question
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, getColleges, createReview } from "../lib/api";

const ReviewsPage = () => {
  const queryClient = useQueryClient();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [form, setForm] = useState({
    collegeId: "",
    studentName: "",
    batch: "2022-2026",
    course: "B.Tech Computer Science",
    ratings: { overall: 5, placement: 5, faculty: 5, campus: 5, value: 5 },
    title: "",
    body: "",
    pros: "",
    cons: ""
  });

  const { data: reviewsRes, isLoading: loading } = useQuery({
    queryKey: ["public-reviews"],
    queryFn: () => getReviews({ limit: 50 }),
    staleTime: 5000,
  });

  const { data: collegesRes } = useQuery({
    queryKey: ["public-colleges-dropdown"],
    queryFn: () => getColleges({ limit: 50 }),
    staleTime: 5000,
  });

  const submitMutation = useMutation({
    mutationFn: (payload) => createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["public-reviews"]);
      alert("Thank you! Your verified review has been submitted.");
      setShowReviewModal(false);
      setForm({
        collegeId: "",
        studentName: "",
        batch: "2022-2026",
        course: "B.Tech Computer Science",
        ratings: { overall: 5, placement: 5, faculty: 5, campus: 5, value: 5 },
        title: "",
        body: "",
        pros: "",
        cons: ""
      });
    },
    onError: () => {
      alert("Failed to submit review. Please try again.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.collegeId || !form.studentName || !form.body) {
      alert("Please fill in all required fields!");
      return;
    }
    const selectedCol = collegeList.find(c => c._id === form.collegeId);
    submitMutation.mutate({
      ...form,
      collegeName: selectedCol?.collegeName || "Verified College",
      isVerified: true,
      status: "Active"
    });
  };

  const reviewList = reviewsRes?.items || [];
  const collegeList = collegesRes?.items || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#08162d] to-[#0f2343] rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="bg-[rgba(226,138,0,0.2)] text-[#e28a00] border border-[rgba(226,138,0,0.3)] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
              Module 3 • Verified Feedback &amp; Trust Signals
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Student Reviews &amp; Campus Ratings
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Read transparent, verified student feedback on college placements, faculty expertise, campus infrastructure, and hostels.
            </p>
          </div>
          <button onClick={() => setShowReviewModal(true)} className="bg-[#e28a00] hover:bg-[#c67900] text-white font-extrabold py-4 px-8 rounded-2xl text-base shadow-2xl transition-all shrink-0 cursor-pointer">
            ⭐ Write a Review
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold">Loading verified student reviews...</div>
        ) : reviewList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 font-semibold shadow-sm">
            No student reviews submitted yet. Be the first to leave a review!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {reviewList.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                        ✓ Verified Student Review
                      </span>
                      <h3 className="text-lg font-black text-[#08162d] mt-2">{r.title || r.message || "Campus Experience Review"}</h3>
                      <p className="text-xs font-bold text-[#e28a00]">{r.collegeName || r.collegeId?.collegeName || "Verified Institute"}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-center shrink-0">
                      <div className="text-lg font-black text-amber-600">★ {r.ratings?.overall || r.rating || 5}.0</div>
                      <div className="text-[9px] font-extrabold text-slate-400 uppercase">Overall</div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed font-medium">{r.body || r.message}</p>

                  {(r.pros || r.cons) && (
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
                      {r.pros && <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100"><span className="font-black text-emerald-700">Pros:</span> {r.pros}</div>}
                      {r.cons && <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100"><span className="font-black text-rose-700">Cons:</span> {r.cons}</div>}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>By <strong>{r.studentName}</strong> ({r.batch || "Alumni"})</span>
                  <span>{r.course || "B.Tech"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto relative">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-[#08162d]">Write a College Review</h3>
                <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-800 font-bold">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Select College *</label>
                  <select value={form.collegeId} onChange={(e) => setForm({ ...form, collegeId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold" required>
                    <option value="">-- Choose College --</option>
                    {collegeList.map((c) => (
                      <option key={c._id} value={c._id}>{c.collegeName}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Your Name *</label>
                    <input type="text" placeholder="Rahul Kumar" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold" required />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Batch Year</label>
                    <input type="text" placeholder="2022-2026" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Overall Star Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={form.ratings.overall} onChange={(e) => setForm({ ...form, ratings: { ...form.ratings, overall: Number(e.target.value) } })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Review Title</label>
                  <input type="text" placeholder="Great placement exposure and campus life" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Written Review *</label>
                  <textarea rows="3" placeholder="Share details about academics, placements, faculty, and hostels..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold" required />
                </div>
                <button type="submit" disabled={submitMutation.isLoading} className="w-full bg-[#e28a00] hover:bg-[#c67900] text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-lg cursor-pointer disabled:opacity-60">
                  {submitMutation.isLoading ? "Submitting..." : "Submit Verified Review"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;

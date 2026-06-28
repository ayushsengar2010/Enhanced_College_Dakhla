import { useState } from "react";
import { api, createLead } from "../lib/api";
import { Link } from "react-router-dom";

const PredictorPage = () => {
  const [formData, setFormData] = useState({
    rank: "",
    score: "",
    examName: "JEE Main 2026",
    stream: "Engineering",
    category: "General",
    state: "Any State"
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  // Lead capture state
  const [leadInfo, setLeadInfo] = useState({ name: "", email: "", phone: "" });
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rank && !formData.score) {
      alert("Please enter your rank or score percentile!");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/predictor/predict", formData);
      setResults(res.data);
    } catch (err) {
      console.error("Predictor error:", err);
      alert("Failed to calculate predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#08162d] to-[#0f2343] rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="bg-[rgba(226,138,0,0.2)] text-[#e28a00] border border-[rgba(226,138,0,0.3)] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
              Module 6 • AI Admission Engine
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              AI Rank &amp; College Predictor <span className="text-[#e28a00]">2026</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Input your score or rank to discover your admission probability across top Indian universities. Our machine learning engine analyzes historical seat cutoffs, category quotas, and trends.
            </p>
          </div>
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-5xl md:text-6xl shrink-0 shadow-2xl">
            🤖
          </div>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-card">
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Select Entrance Exam</label>
              <select name="examName" value={formData.examName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#e28a00]">
                <option value="JEE Main 2026">JEE Main 2026</option>
                <option value="NEET UG 2026">NEET UG 2026</option>
                <option value="CAT 2026">CAT 2026 (MBA)</option>
                <option value="GATE 2026">GATE 2026</option>
                <option value="BITSAT 2026">BITSAT 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Your All India Rank (AIR)</label>
              <input type="number" name="rank" placeholder="e.g. 4500" value={formData.rank} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#e28a00]" />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#e28a00]">
                <option value="General">General / Open</option>
                <option value="OBC-NCL">OBC-NCL</option>
                <option value="EWS">EWS</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Preferred Stream</label>
              <select name="stream" value={formData.stream} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#e28a00]">
                <option value="Engineering">Engineering (B.Tech)</option>
                <option value="Management">Management (MBA)</option>
                <option value="Medical">Medical (MBBS)</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Preferred State</label>
              <select name="state" value={formData.state} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#e28a00]">
                <option value="Any State">Any State (All India)</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div className="md:col-span-1 flex items-end">
              <button type="submit" disabled={loading} className="w-full bg-[#e28a00] hover:bg-[#c67900] text-white font-extrabold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2">
                {loading ? "Calculating Predictions..." : "⚡ Predict My Colleges"}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            {/* Metrics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
                <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Colleges Analyzed</div>
                <div className="text-3xl font-black text-[#08162d] mt-1">{results.summary.totalMatches}</div>
              </div>
              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-center">
                <div className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Safe Choices (90%+ Chance)</div>
                <div className="text-3xl font-black text-emerald-700 mt-1">{results.summary.safeCount}</div>
              </div>
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-center">
                <div className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Target Choices (60-80%)</div>
                <div className="text-3xl font-black text-amber-700 mt-1">{results.summary.targetCount}</div>
              </div>
              <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 text-center">
                <div className="text-xs font-extrabold text-rose-600 uppercase tracking-wider">Dream Choices (&lt;50%)</div>
                <div className="text-3xl font-black text-rose-700 mt-1">{results.summary.dreamCount}</div>
              </div>
            </div>

            {/* Bucket Cards */}
            {["safe", "target", "dream"].map((bucket) => {
              const items = results.predictions[bucket];
              if (!items || items.length === 0) return null;
              const badgeColors = {
                safe: "bg-emerald-500 text-white",
                target: "bg-amber-500 text-white",
                dream: "bg-rose-500 text-white"
              };
              const titles = {
                safe: "🟢 Safe Colleges (High Probability of Admission)",
                target: "🟡 Target Colleges (Competitive Match)",
                dream: "🔴 Dream / Ambitious Colleges (Reach Target)"
              };

              return (
                <div key={bucket} className="space-y-4">
                  <h3 className="text-xl font-black text-[#08162d]">{titles[bucket]}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {items.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${badgeColors[bucket]}`}>
                              {item.probability}% Probability ({item.chance})
                            </span>
                            <h4 className="text-lg font-black text-[#08162d] mt-2">{item.college.collegeName}</h4>
                            <p className="text-xs text-slate-500 font-semibold">{item.college.city}, {item.college.state} • NIRF #{item.college.ranking}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs text-slate-400 font-bold">Avg Package</div>
                            <div className="text-sm font-black text-emerald-600">{item.college.averagePackage}</div>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                          💡 <strong>AI Insight:</strong> {item.insight}
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                          <span className="font-bold text-slate-500">Annual Fee: ₹{item.college.fees?.toLocaleString('en-IN')}</span>
                          <Link to={`/college/${item.college.slug}`} className="font-extrabold text-[#e28a00] hover:underline flex items-center gap-1">
                            Explore College &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Lead Capture Section ── */}
        {results && !leadSubmitted && (
          <div className="bg-white rounded-2xl border-2 border-[#e28a00]/30 p-6 md:p-8 shadow-card">
            <div className="text-center space-y-2 mb-6">
              <span className="bg-[rgba(226,138,0,0.15)] text-[#e28a00] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block border border-[rgba(226,138,0,0.2)]">
                🎯 Get Personalized Counseling
              </span>
              <h3 className="text-xl font-black text-[#08162d]">
                Want Help With Admissions?
              </h3>
              <p className="text-xs text-slate-500 max-w-xl mx-auto">
                Share your contact details and our expert counselors will guide you through the admission process, scholarship options, and college comparisons based on your predictor results.
              </p>
            </div>

            {leadError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl text-center mb-4">
                ⚠️ {leadError}
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!leadInfo.name.trim()) return setLeadError("Please enter your name.");
                if (!leadInfo.email.trim() || !/\S+@\S+\.\S+/.test(leadInfo.email)) return setLeadError("Please enter a valid email address.");
                if (!leadInfo.phone.trim() || leadInfo.phone.length < 10) return setLeadError("Please enter a valid 10-digit mobile number.");

                setLeadLoading(true);
                setLeadError("");
                try {
                  await createLead({
                    ...leadInfo,
                    state: formData.state !== "Any State" ? formData.state : "",
                    course: formData.stream,
                    source: "college_predictor",
                    message: `Rank: ${formData.rank || "N/A"}, Exam: ${formData.examName}, Category: ${formData.category}, Stream: ${formData.stream}`
                  });
                  setLeadSubmitted(true);
                } catch (err) {
                  setLeadError(err.response?.data?.message || "Failed to submit. Please try again.");
                } finally {
                  setLeadLoading(false);
                }
              }}
              className="grid md:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  type="text"
                  value={leadInfo.name}
                  onChange={(e) => { setLeadInfo({ ...leadInfo, name: e.target.value }); setLeadError(""); }}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#e28a00]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Email *</label>
                <input
                  type="email"
                  value={leadInfo.email}
                  onChange={(e) => { setLeadInfo({ ...leadInfo, email: e.target.value }); setLeadError(""); }}
                  placeholder="rahul@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#e28a00]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Mobile *</label>
                <input
                  type="tel"
                  value={leadInfo.phone}
                  onChange={(e) => { setLeadInfo({ ...leadInfo, phone: e.target.value }); setLeadError(""); }}
                  placeholder="9876543210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#e28a00]"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={leadLoading}
                  className="w-full bg-[#08162d] hover:bg-[#0f2343] text-white font-extrabold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {leadLoading ? "Submitting..." : "📞 Get Free Counseling"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Lead Submitted Confirmation ── */}
        {leadSubmitted && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center space-y-3 shadow-card">
            <span className="text-5xl">✅</span>
            <h3 className="text-xl font-black text-emerald-800">Enquiry Submitted Successfully!</h3>
            <p className="text-sm text-emerald-600 max-w-lg mx-auto">
              Thank you, <strong>{leadInfo.name}</strong>! Our admission counselor will reach out to you shortly at <strong>{leadInfo.phone}</strong> and <strong>{leadInfo.email}</strong> to guide you through the next steps.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setLeadSubmitted(false);
                  setLeadInfo({ name: "", email: "", phone: "" });
                }}
                className="bg-white border border-emerald-300 text-emerald-700 font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-100 transition-all"
              >
                🔄 Submit Another
              </button>
              <Link to="/" className="bg-[#08162d] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-[#0f2343] transition-all">
                🏠 Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictorPage;

import { useState } from "react";
import { Link } from "react-router-dom";
import { createLead } from "../lib/api";

const STATES = [
  "Delhi NCR", "Haryana", "Maharashtra", "Tamil Nadu", "Uttar Pradesh", 
  "Karnataka", "West Bengal", "Punjab", "Rajasthan", "Telangana", "Uttarakhand", "Assam"
];

const COURSES = [
  "B.Tech Computer Science and Engineering",
  "B.Tech Artificial Intelligence and Machine Learning",
  "B.Tech Electronics and Communication",
  "MBA Finance and Investment Banking",
  "MBA Marketing and Brand Strategy",
  "MBBS Bachelor of Medicine and Surgery",
  "B.Com Honours Accounting & Finance",
  "BA Journalism and Mass Communication",
  "B.Des Animation and VFX",
  "B.Pharm Bachelor of Pharmacy"
];

const SmartLeadRecommendationSystem = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    course: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) return setError("Please enter your full name.");
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return setError("Please enter a valid email address.");
    if (!formData.phone.trim() || formData.phone.length < 10) return setError("Please enter a valid 10-digit mobile number.");
    if (!formData.state) return setError("Please select your preferred state.");
    if (!formData.course) return setError("Please select your preferred course.");

    try {
      setLoading(true);
      setError("");
      const response = await createLead({ ...formData, source: "home_recommendation_portal" });

      setTimeout(() => {
        setLoading(false);
        setRecommendations(response.recommendedColleges || []);
        setStudentInfo(response.lead || formData);
      }, 700);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to process enquiry. Please try again.");
    }
  };

  const resetForm = () => {
    setRecommendations(null);
    setStudentInfo(null);
    setFormData({ name: "", email: "", phone: "", state: "", city: "", course: "" });
  };

  return (
    <section className="bg-gradient-to-br from-[#08162d] via-[#0f2343] to-[#162d50] rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden my-2 max-w-5xl mx-auto w-full">
      {/* Close button for modal mode */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-black transition-all z-20 cursor-pointer border border-white/20"
          title="Close Finder"
        >
          ✕
        </button>
      )}

      {/* Glow ambient decorations */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#e28a00]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Section Header */}
        <div className="text-center space-y-2 pr-6">
          <span className="bg-[rgba(226,138,0,0.2)] text-[#e28a00] border border-[rgba(226,138,0,0.3)] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block shadow-sm">
            🎓 Smart AI College Recommendation Engine
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Find Your Top Best Matching Colleges
          </h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Fill out your details below. Our recommendation engine will instantly analyze institutional rankings and cutoffs based on your preferred state.
          </p>
        </div>

        {/* Form View */}
        {!recommendations && !loading && (
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 space-y-5 shadow-inner">
            {error && (
              <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold p-3 rounded-xl text-center animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-300 mb-1.5 font-bold uppercase tracking-wider text-[10px]">Student Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-900/80 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#e28a00] transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-bold uppercase tracking-wider text-[10px]">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@gmail.com"
                  className="w-full bg-slate-900/80 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#e28a00] transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-bold uppercase tracking-wider text-[10px]">Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-900/80 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#e28a00] transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-300 mb-1.5 font-bold uppercase tracking-wider text-[10px]">Preferred State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e28a00] transition-all"
                >
                  <option value="">Select State</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-bold uppercase tracking-wider text-[10px]">Target City (Optional)</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Gurugram, Mathura, Noida"
                  className="w-full bg-slate-900/80 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#e28a00] transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-bold uppercase tracking-wider text-[10px]">Course of Interest *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e28a00] transition-all"
                >
                  <option value="">Choose Course</option>
                  {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                className="bg-[#e28a00] hover:bg-[#c67900] text-white font-black text-sm px-8 py-4 rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                🔍 Submit Enquiry &amp; View Top Colleges →
              </button>
            </div>
          </form>
        )}

        {/* Loading Spinner View */}
        {loading && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 border-4 border-[#e28a00] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-extrabold text-amber-400 animate-pulse">
              Matching your preferences with live MongoDB database records...
            </p>
          </div>
        )}

        {/* Recommendation Results View */}
        {recommendations && (
          <div className="bg-white text-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                  🎉 Custom Matches Generated for {studentInfo?.name}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-[#08162d] mt-2">
                  Top Colleges in {studentInfo?.state || "India"} for {studentInfo?.course}
                </h3>
              </div>
              <button
                onClick={resetForm}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                🔄 Submit New Enquiry
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map((col, idx) => (
                <div key={col._id || idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#08162d] text-[#e28a00] font-black text-[10px] px-3 py-1 rounded-bl-xl border-b border-l border-white/10">
                    Rank #{col.ranking || idx + 1}
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-[#08162d] shadow-sm">
                      {col.shortName || "COL"}
                    </div>
                    <h4 className="font-extrabold text-[#08162d] text-base leading-snug group-hover:text-[#e28a00] transition-colors line-clamp-2">
                      {col.collegeName}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      📍 {col.location || `${col.city}, ${col.state}`}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/60 grid grid-cols-2 gap-2 text-xs font-semibold">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Annual Tuition</span>
                      <span className="text-slate-800 font-black">₹{(col.fees ? col.fees.toLocaleString() : "1,85,000")} / Yr</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Highest Package</span>
                      <span className="text-emerald-600 font-black">{col.highestPackage || "55 LPA"}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      ★ {col.rating || 4.6} / 5
                    </span>
                    <Link
                      to={`/college/${col.slug}`}
                      onClick={() => onClose && onClose()}
                      className="bg-[#08162d] hover:bg-[#e28a00] text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      Explore College →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs flex items-center justify-between flex-wrap gap-3">
              <span>ℹ️ <strong>Enquiry Recorded:</strong> Your application details are assigned and accessible in the Admin Dashboard.</span>
              <Link to="/contact" onClick={() => onClose && onClose()} className="font-extrabold text-[#e28a00] hover:underline">
                Request Dedicated Counselor Callback &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SmartLeadRecommendationSystem;

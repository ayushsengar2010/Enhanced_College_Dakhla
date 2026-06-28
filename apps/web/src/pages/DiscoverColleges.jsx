import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* SVG Vector Components */
const CodeIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);
const ChartIcon = () => (
  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const CoinIcon = () => (
  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const PaletteIcon = () => (
  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343a2 2 0 01-1.414-.586l-1.586-1.586a2 2 0 00-1.414-.586H9" />
  </svg>
);
const HealthIcon = () => (
  <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CityBuildingIcon = () => (
  <svg className="w-5 h-5 text-[#08162d]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-9a2 2 0 012-2h2a2 2 0 012 2v9m-4 0h4" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-5 h-5 text-[#e28a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SearchLensIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const POPULAR_CITIES = [
  { name: "New Delhi", state: "Delhi" },
  { name: "Gurgaon", state: "Haryana" },
  { name: "Noida", state: "Uttar Pradesh" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Bangalore", state: "Karnataka" },
];

const POPULAR_STATES = [
  { name: "Delhi" },
  { name: "Maharashtra" },
  { name: "Karnataka" },
  { name: "Tamil Nadu" },
  { name: "Uttar Pradesh" },
  { name: "West Bengal" },
  { name: "Rajasthan" },
  { name: "Gujarat" },
];

const STUDY_PREFERENCES = [
  {
    category: "Engineering",
    icon: <CodeIcon />,
    subCourses: ["BE/B.Tech", "Diploma in Engineering", "ME/M.Tech"]
  },
  {
    category: "Management",
    icon: <ChartIcon />,
    subCourses: ["MBA/PGDM", "BBA/BMS", "Executive MBA"]
  },
  {
    category: "Commerce",
    icon: <CoinIcon />,
    subCourses: ["B.Com", "M.Com"]
  },
  {
    category: "Arts & Humanities",
    icon: <PaletteIcon />,
    subCourses: ["BA", "MA", "BFA"]
  },
  {
    category: "Medical",
    icon: <HealthIcon />,
    subCourses: ["MBBS", "BDS", "BAMS", "Nursing"]
  }
];

const DiscoverColleges = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState("BE/B.Tech");
  const [selectedStream, setSelectedStream] = useState("Engineering");
  const [locationSearch, setLocationSearch] = useState("");

  const handleCourseSelect = (stream, course) => {
    setSelectedStream(stream);
    setSelectedCourse(course);
    setStep(2);
  };

  const handleLocationSelect = ({ city, state }) => {
    const params = new URLSearchParams();
    if (selectedStream) params.set("stream", selectedStream);
    if (courseToSearch(selectedCourse)) params.set("course", courseToSearch(selectedCourse));
    if (city) params.set("city", city);
    if (state) params.set("state", state);
    navigate(`/colleges?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!locationSearch) return;
    const params = new URLSearchParams();
    if (selectedStream) params.set("stream", selectedStream);
    if (courseToSearch(selectedCourse)) params.set("course", courseToSearch(selectedCourse));
    params.set("search", locationSearch);
    navigate(`/colleges?${params.toString()}`);
  };

  const courseToSearch = (c) => {
    if (c.includes("B.Tech")) return "B.Tech";
    if (c.includes("MBA")) return "MBA";
    if (c.includes("B.Com")) return "B.Com";
    if (c.includes("MBBS")) return "MBBS";
    return c;
  };

  const filteredCities = POPULAR_CITIES.filter(c => c.name.toLowerCase().includes(locationSearch.toLowerCase()));
  const filteredStates = POPULAR_STATES.filter(s => s.name.toLowerCase().includes(locationSearch.toLowerCase()));

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="bg-gradient-to-r from-[#08162d] to-[#0f2343] py-14 px-6 md:px-10 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-block bg-[rgba(226,138,0,0.15)] text-[#e28a00] border border-[rgba(226,138,0,0.3)] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            🎯 Module 1 • Guided Discovery
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Discover Your Perfect College
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            A step-by-step guided funnel to find the best colleges matching your study preferences and location.
          </p>
          <p className="text-[rgba(255,255,255,0.45)] text-xs">
            <Link to="/" className="hover:text-[#e28a00] transition-colors">Home</Link>
            <span className="mx-2">//</span>
            <span className="text-[rgba(255,255,255,0.70)]">Guided Discovery</span>
          </p>
        </div>
      </section>

      {/* ── Step Indicator ── */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-10 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3 text-xs font-bold text-slate-500">
          <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-[#e28a00] font-black' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
              step === 1 ? 'bg-[#e28a00] text-white' : step > 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
            }`}>1</span>
            Study Preference
          </span>
          <span className="text-slate-300 text-lg">→</span>
          <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-[#e28a00] font-black' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
              step === 2 ? 'bg-[#e28a00] text-white' : 'bg-slate-200 text-slate-500'
            }`}>2</span>
            Location &amp; Colleges
          </span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="py-10 px-4 md:px-10 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Step 1: Study Preference */}
            {step === 1 && (
              <div className="p-6 md:p-10 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#08162d]">Select Your Study Preference</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">Choose your stream and preferred degree program</p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs font-extrabold text-[#e28a00] hover:underline">
                    Skip &rarr;
                  </button>
                </div>

                <div className="space-y-6">
                  {STUDY_PREFERENCES.map((pref) => (
                    <div key={pref.category} className="space-y-3">
                      <div className="flex items-center gap-2.5 text-sm font-black text-[#08162d]">
                        <span>{pref.icon}</span>
                        <span>{pref.category}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {pref.subCourses.map((sc) => (
                          <button
                            key={sc}
                            onClick={() => handleCourseSelect(pref.category, sc)}
                            className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-[rgba(226,138,0,0.08)] border border-slate-200 hover:border-[#e28a00] rounded-xl text-xs font-bold text-slate-700 hover:text-[#e28a00] transition-all text-left group"
                          >
                            <span>{sc}</span>
                            <span className="text-slate-400 group-hover:text-[#e28a00] transition-colors">&rsaquo;</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Location Preference */}
            {step === 2 && (
              <div className="p-6 md:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                      <span>Your Selected Goal:</span>
                      <span className="bg-emerald-50 text-emerald-700 font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                        ✓ Course: {selectedCourse} ({selectedStream})
                      </span>
                      <button onClick={() => setStep(1)} className="text-[#e28a00] underline font-extrabold text-xs ml-1">Modify</button>
                    </div>
                    <h2 className="text-xl font-black text-[#08162d]">Select / Search Your Preferred City or State</h2>
                  </div>
                  <button onClick={() => handleLocationSelect({})} className="text-xs font-extrabold text-[#e28a00] hover:underline shrink-0">
                    Skip &rarr;
                  </button>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <SearchLensIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by city or state name (e.g. Delhi, Maharashtra, Bangalore)..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#e28a00] transition-colors"
                  />
                  <button type="submit" className="absolute right-2 top-2 bottom-2 bg-[#08162d] text-[#e28a00] text-xs font-extrabold px-4 rounded-xl">
                    Search
                  </button>
                </form>

                {/* Distinct Columns for Cities & States */}
                <div className="grid md:grid-cols-2 gap-8 pt-2">
                  {/* Column 1: Popular Cities */}
                  <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
                      <CityBuildingIcon />
                      <h3 className="text-sm font-black text-[#08162d] uppercase tracking-wider">Popular Cities</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {filteredCities.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => handleLocationSelect({ city: city.name, state: city.state })}
                          className="flex items-center justify-between p-3 bg-white border border-slate-200 hover:border-[#08162d] hover:shadow-sm rounded-xl text-xs font-bold text-slate-800 transition-all group text-left"
                        >
                          <span>{city.name}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-[#08162d] font-semibold">{city.state}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Popular States */}
                  <div className="space-y-4 bg-amber-50/30 p-5 rounded-2xl border border-amber-200/40">
                    <div className="flex items-center gap-2 border-b border-amber-200/60 pb-3">
                      <MapPinIcon />
                      <h3 className="text-sm font-black text-[#08162d] uppercase tracking-wider">Popular States</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {filteredStates.map((state) => (
                        <button
                          key={state.name}
                          onClick={() => handleLocationSelect({ state: state.name })}
                          className="flex items-center justify-between p-3 bg-white border border-amber-200/60 hover:border-[#e28a00] hover:shadow-sm rounded-xl text-xs font-bold text-slate-800 transition-all group text-left"
                        >
                          <span>{state.name}</span>
                          <span className="text-[#e28a00] font-black text-xs">&rsaquo;</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                  <button onClick={() => setStep(1)} className="text-xs font-bold text-slate-500 hover:text-[#e28a00] transition-colors">
                    &larr; Back to Course Selection
                  </button>
                  <button onClick={() => handleLocationSelect({})} className="bg-[#08162d] hover:bg-[#0f2343] text-[#e28a00] font-extrabold px-6 py-3 rounded-xl text-xs transition-all shadow-md">
                    View All Colleges &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoverColleges;

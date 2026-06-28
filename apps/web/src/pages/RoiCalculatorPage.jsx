import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getColleges } from "../lib/api";

const RoiCalculatorPage = () => {
  const [selectedCollegeId, setSelectedCollegeId] = useState("");

  const [tuitionFee, setTuitionFee] = useState(850000);
  const [hostelFee, setHostelFee] = useState(200000);
  const [scholarship, setScholarship] = useState(50000);
  const [averageCtc, setAverageCtc] = useState(1600000);

  const { data: collegesRes, isLoading } = useQuery({
    queryKey: ["roi-colleges"],
    queryFn: () => getColleges({ limit: 50 }),
    staleTime: 60000,
  });

  const colleges = collegesRes?.items || [];

  const handleCollegeSelect = (e) => {
    const id = e.target.value;
    setSelectedCollegeId(id);
    const found = colleges.find(c => c._id === id);
    if (found) {
      if (found.fees) setTuitionFee(found.fees * 4);
      if (found.highestPackage) {
        const match = found.highestPackage.match(/[\d.]+/);
        if (match) {
          const num = parseFloat(match[0]);
          // If in CPA or LPA, scale appropriately
          if (found.highestPackage.includes("CPA")) {
            setAverageCtc(num * 10000000 * 0.4); // Average ~40% of peak CPA
          } else {
            setAverageCtc(num * 100000 * 0.6); // Average ~60% of peak LPA
          }
        }
      }
    }
  };

  const totalInvestment = Math.max(0, tuitionFee + hostelFee - scholarship);
  const annualReturn = averageCtc;
  const roiPercentage = totalInvestment > 0 ? (((annualReturn - totalInvestment) / totalInvestment) * 100).toFixed(1) : 0;
  const paybackPeriodYears = annualReturn > 0 ? (totalInvestment / annualReturn).toFixed(1) : 0;

  const selectedCollegeObj = colleges.find(c => c._id === selectedCollegeId);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#08162d] to-[#0f2343] rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="bg-[rgba(226,138,0,0.2)] text-[#e28a00] border border-[rgba(226,138,0,0.3)] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
              Module 12 • Financial Intelligence
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              College Return on Investment (ROI) Calculator
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Evaluate whether a college is financially worth it. Calculate total tuition &amp; living expenditure versus expected starting salary and payback timeframe.
            </p>
          </div>
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-5xl md:text-6xl shrink-0 shadow-2xl">
            📈
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-card space-y-6">
            <h2 className="text-xl font-black text-[#08162d] border-b border-slate-100 pb-4">
              1. Financial Parameters
            </h2>

            {/* Quick Preset Selector */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Select a College for Auto-Fill (Optional)
              </label>
              <select value={selectedCollegeId} onChange={handleCollegeSelect} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#e28a00]">
                <option value="">-- Choose College Preset --</option>
                {isLoading ? (
                  <option disabled>Loading colleges from database...</option>
                ) : (
                  colleges.map((c) => (
                    <option key={c._id} value={c._id}>{c.collegeName} ({c.city})</option>
                  ))
                )}
              </select>
            </div>

            {/* Tuition Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-600">Total Course Tuition Fee</span>
                <span className="text-[#08162d] font-black">₹{tuitionFee.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min="100000" max="3000000" step="50000" value={tuitionFee} onChange={(e) => setTuitionFee(Number(e.target.value))} className="w-full accent-[#e28a00]" />
            </div>

            {/* Hostel Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-600">Hostel &amp; Living Expenses</span>
                <span className="text-[#08162d] font-black">₹{hostelFee.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min="0" max="1000000" step="25000" value={hostelFee} onChange={(e) => setHostelFee(Number(e.target.value))} className="w-full accent-[#e28a00]" />
            </div>

            {/* Scholarship Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-600">Scholarships &amp; Grants Deduction</span>
                <span className="text-emerald-600 font-black">- ₹{scholarship.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min="0" max="1000000" step="25000" value={scholarship} onChange={(e) => setScholarship(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>

            {/* Average CTC Slider */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-600">Expected Starting Package (Average CTC)</span>
                <span className="text-emerald-700 font-black">₹{(averageCtc / 100000).toFixed(1)} LPA</span>
              </div>
              <input type="range" min="300000" max="5000000" step="50000" value={averageCtc} onChange={(e) => setAverageCtc(Number(e.target.value))} className="w-full accent-emerald-600" />
            </div>
          </div>

          {/* ROI Output Summary Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-card space-y-6 sticky top-24">
            <h2 className="text-xl font-black text-[#08162d] border-b border-slate-100 pb-4">
              2. Investment &amp; Returns Analysis
            </h2>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="text-xs font-extrabold text-slate-500 uppercase">Net Investment</span>
                <span className="text-lg font-black text-[#08162d]">₹{totalInvestment.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="text-xs font-extrabold text-slate-500 uppercase">First Year Earning (CTC)</span>
                <span className="text-lg font-black text-emerald-600">₹{annualReturn.toLocaleString('en-IN')}</span>
              </div>

              {/* Highlight Badges */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center">
                  <div className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">Net ROI Percentage</div>
                  <div className="text-2xl md:text-3xl font-black text-emerald-800 mt-1">+{roiPercentage}%</div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center">
                  <div className="text-[11px] font-black text-amber-700 uppercase tracking-wider">Payback Time</div>
                  <div className="text-2xl md:text-3xl font-black text-amber-800 mt-1">{paybackPeriodYears} Yrs</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs leading-relaxed">
              💡 <strong>Financial Verdict:</strong> {paybackPeriodYears <= 1.5 ? "Exceptional ROI! The earnings recover your entire degree expenditure in less than 1.5 years." : "Standard return profile. Ensure high academic consistency to target top quartile packages."}
            </div>

            {selectedCollegeObj && (
              <Link to={`/college/${selectedCollegeObj.slug}`} className="block text-center bg-[#e28a00] hover:bg-[#c67900] text-white font-extrabold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg">
                Explore {selectedCollegeObj.shortName || selectedCollegeObj.collegeName} Insights &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoiCalculatorPage;

import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAlerts, subscribeAlerts } from "../lib/api";

const typeColor = {
  Exam:      "bg-blue-50 text-blue-700 border-blue-200",
  Result:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Admission: "bg-purple-50 text-purple-700 border-purple-200",
  Deadline:  "bg-red-50 text-red-700 border-red-200",
  Other:     "bg-slate-100 text-slate-600 border-slate-200",
};
const typeIcon = { Exam:"📝", Result:"🏆", Admission:"🎓", Deadline:"⏰", Other:"🔔" };

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : null;

const AlertsPage = () => {
  const [type,   setType]   = useState("");
  const [subForm, setSubForm] = useState({ email:"", name:"" });
  const [subStatus, setSubStatus] = useState("idle");

  const { data, isLoading } = useQuery({
    queryKey: ["alerts", type],
    queryFn:  () => getAlerts({ type: type||undefined, limit: 20 }),
    staleTime: 60000,
  });
  const alerts = data?.items || [];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubStatus("loading");
    try {
      await subscribeAlerts({ email: subForm.email.trim(), name: subForm.name.trim() });
      setSubStatus("success");
    } catch {
      setSubStatus("error");
    }
  };

  return (
    <div>
      <section className="hero-bg py-14 px-6 md:px-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Admission Alerts</h1>
        <p className="text-[rgba(255,255,255,0.60)] text-sm max-w-xl mx-auto">
          Stay updated with exam deadlines, result dates, and admission notifications.
        </p>
        <p className="text-[rgba(255,255,255,0.40)] text-xs mt-3">
          <Link to="/" className="hover:text-[#e28a00]">Home</Link><span className="mx-2">//</span>Alerts
        </p>
      </section>

      <section className="py-10 px-6 md:px-10 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 items-start">

          {/* Left: alerts list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Type filter */}
            <div className="flex flex-wrap gap-2">
              {["", "Exam","Result","Admission","Deadline","Other"].map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${type===t ? "text-white border-[#e28a00]" : "bg-white border-slate-200 text-slate-600 hover:border-[#e28a00]"}`}
                  style={type===t ? { backgroundColor:"#e28a00" } : {}}>
                  {t ? `${typeIcon[t]} ${t}` : "🔔 All"}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-4">{[1,2,3].map((n) => <div key={n} className="bg-white rounded-2xl p-5 animate-pulse h-24 border border-slate-200"/>)}</div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <div className="text-4xl mb-3">🔔</div>
                <p className="font-semibold text-slate-500">No alerts right now</p>
                <p className="text-xs text-slate-400 mt-1">Subscribe below to get notified when alerts are posted</p>
              </div>
            ) : (
              alerts.map((alert) => {
                const c = typeColor[alert.type] || typeColor.Other;
                return (
                  <div key={alert._id} className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: "rgba(226,138,0,0.10)" }}>
                      {typeIcon[alert.type] || "🔔"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${c}`}>{alert.type}</span>
                        {alert.deadline && (
                          <span className="text-[10px] font-bold text-red-500">🗓 Deadline: {fmt(alert.deadline)}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-black text-[#08162d]">{alert.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{alert.body}</p>
                      {alert.link && (
                        <a href={alert.link} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-bold text-[#e28a00] hover:underline mt-1 inline-block">
                          View Details →
                        </a>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 shrink-0 mt-1">
                      {new Date(alert.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short" })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Subscribe */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-lg space-y-4">
            <div className="text-center">
              <div className="text-3xl mb-2">📬</div>
              <h3 className="text-lg font-black text-[#08162d]">Get Instant Alerts</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Subscribe and receive admission deadlines, result dates, and exam updates directly in your inbox.
              </p>
            </div>

            {subStatus === "success" ? (
              <div className="text-center py-6 space-y-2">
                <div className="text-4xl">✅</div>
                <p className="font-extrabold text-[#08162d]">Subscribed!</p>
                <p className="text-xs text-slate-500">You&apos;ll receive alerts at {subForm.email}</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input required type="text" placeholder="Your Name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e28a00] transition-colors"
                  value={subForm.name} onChange={(e) => setSubForm((p) => ({ ...p, name: e.target.value }))} />
                <input required type="email" placeholder="Email Address *"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e28a00] transition-colors"
                  value={subForm.email} onChange={(e) => setSubForm((p) => ({ ...p, email: e.target.value }))} />
                {subStatus === "error" && (
                  <p className="text-xs text-red-500 font-medium">Something went wrong. Try again.</p>
                )}
                <button type="submit" disabled={subStatus==="loading"}
                  className="w-full text-white font-extrabold py-2.5 rounded-xl text-sm transition-all disabled:opacity-60"
                  style={{ backgroundColor:"#e28a00" }}>
                  {subStatus==="loading" ? "Subscribing…" : "🔔 Subscribe Now"}
                </button>
              </form>
            )}

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">✅ No spam, ever</p>
              <p className="flex items-center gap-2">✅ Unsubscribe anytime</p>
              <p className="flex items-center gap-2">✅ Covers JEE, NEET, CAT, GATE &amp; more</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlertsPage;

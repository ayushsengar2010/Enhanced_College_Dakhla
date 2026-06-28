import { useState } from "react";
import { createLead } from "../../lib/api";

const inputCls =
  "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e28a00] transition-colors placeholder-slate-400 bg-white";

const LeadForm = ({ collegeId }) => {
  const [form, setForm]     = useState({ name: "", email: "", phone: "", city: "", course: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "Enter a valid 10-digit mobile";
    return e;
  };

  const field = (key) => ({
    value:    form[key],
    onChange: (ev) => {
      setForm((p) => ({ ...p, [key]: ev.target.value }));
      if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
    },
  });

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    try {
      await createLead({
        name:      form.name.trim(),
        email:     form.email.trim(),
        phone:     form.phone.trim(),
        city:      form.city.trim()  || undefined,
        course:    form.course       || undefined,
        collegeId: collegeId         || undefined,
        source:    "college_detail",
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", city: "", course: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="py-8 text-center space-y-3">
        <div className="text-4xl">✅</div>
        <p className="font-extrabold text-navy text-base">Enquiry Submitted!</p>
        <p className="text-slate-500 text-xs">Our counsellor will call you within 24 hours.</p>
        <button onClick={() => setStatus("idle")} className="text-xs text-[#e28a00] font-bold hover:underline">
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div>
        <input {...field("name")} placeholder="Full Name *"
          className={`${inputCls} ${errors.name ? "border-red-400" : ""}`} />
        {errors.name && <p className="text-red-500 text-[11px] mt-0.5 font-medium">{errors.name}</p>}
      </div>
      <div>
        <input {...field("email")} type="email" placeholder="Email Address *"
          className={`${inputCls} ${errors.email ? "border-red-400" : ""}`} />
        {errors.email && <p className="text-red-500 text-[11px] mt-0.5 font-medium">{errors.email}</p>}
      </div>
      <div>
        <input {...field("phone")} type="tel" placeholder="Mobile Number *" maxLength={10}
          className={`${inputCls} ${errors.phone ? "border-red-400" : ""}`} />
        {errors.phone && <p className="text-red-500 text-[11px] mt-0.5 font-medium">{errors.phone}</p>}
      </div>
      <input {...field("city")} placeholder="Your City" className={inputCls} />
      <select {...field("course")} className={`${inputCls} text-slate-600`}>
        <option value="">Select Course Stream</option>
        <option>Engineering (B.Tech / M.Tech)</option>
        <option>Management (MBA / BBA)</option>
        <option>Commerce (B.Com / M.Com)</option>
        <option>Arts &amp; Humanities (BA / MA)</option>
        <option>Medical / Pharmacy</option>
        <option>Law (LLB / LLM)</option>
        <option>Design (B.Des / M.Des)</option>
      </select>

      {status === "error" && (
        <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-medium">
          Something went wrong. Please try again or call us directly.
        </p>
      )}

      <button type="submit" disabled={status === "loading"}
        className="w-full bg-[#e28a00] hover:bg-[#c67900] disabled:opacity-60 text-white font-extrabold py-3 rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
        style={{ boxShadow: "0 6px 20px rgba(226,138,0,0.30)" }}>
        {status === "loading" ? (
          <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg> Submitting…</>
        ) : "🚀 Submit Enquiry"}
      </button>
    </form>
  );
};

export default LeadForm;

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createLead } from "../lib/api";

const inputCls =
  "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e28a00] transition-colors placeholder-slate-400";

/* ── Icons ───────────────────────────────────────────────────────── */
const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
  </svg>
);
const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);
const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════════════════ */
const Contact = () => {
  const [form, setForm]     = useState({ firstName: "", lastName: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const timerRef            = useRef(null);

  /* cleanup timer on unmount */
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await createLead({
        name:    `${form.firstName} ${form.lastName}`.trim(),
        email:   form.email.trim(),
        phone:   form.phone.trim(),
        message: form.message.trim() || undefined,
        source:  "contact_page",
      });
      setStatus("success");
      setForm({ firstName: "", lastName: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus((s) => (s === "error" ? "idle" : s)), 5000);
  };

  return (
    <div>
      {/* Banner */}
      <section className="hero-bg py-14 px-6 md:px-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Contact Us</h1>
        <p className="text-[rgba(255,255,255,0.50)] text-sm font-medium">
          <Link to="/" className="hover:text-[#e28a00] transition-colors">Home</Link>
          <span className="mx-2 text-[rgba(255,255,255,0.30)]">//</span>
          <span className="text-[rgba(255,255,255,0.70)]">Contact Us</span>
        </p>
      </section>

      {/* Main */}
      <section className="py-14 px-6 md:px-10 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">

          {/* Left */}
          <div className="space-y-5">
            {/* Office card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-4" style={{ boxShadow: "0 4px 16px rgba(8,22,45,0.08)" }}>
              <h2 className="text-lg font-black text-[#08162d]">Corporate Office</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="text-[#e28a00] mt-0.5 shrink-0"><LocationIcon /></span>
                  <span className="leading-relaxed">First Floor, Plot No. 2, Niti Khand 1, Near Mangal Chowk, Indirapuram, Ghaziabad – 201014, Uttar Pradesh</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-[#e28a00] shrink-0"><PhoneIcon /></span>
                  <a href="tel:+919650668966" className="hover:text-[#e28a00] transition-colors font-medium">+91 9650668966</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-[#e28a00] shrink-0"><MailIcon /></span>
                  <a href="mailto:info@collegedakhla.com" className="hover:text-[#e28a00] transition-colors font-medium">info@collegedakhla.com</a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200" style={{ boxShadow: "0 4px 16px rgba(8,22,45,0.08)" }}>
              <iframe
                title="College Dakhla Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.669741635421!2d77.36284031455588!3d28.645658182413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sIndirapuram%2C+Ghaziabad%2C+Uttar+Pradesh!5e0!3m2!1sen!2sin!4v1561007267671"
                width="100%" height="260" style={{ border: 0 }}
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Quick tiles */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <PhoneIcon />, label: "Call Us",   value: "+91 9650668966",       href: "tel:+919650668966"           },
                { icon: <MailIcon />,  label: "Email Us",  value: "info@collegedakhla.com", href: "mailto:info@collegedakhla.com" },
              ].map((t) => (
                <a key={t.label} href={t.href}
                  className="bg-white border border-slate-200 hover:border-[#e28a00] rounded-xl p-4 text-center space-y-1.5 hover:shadow-md transition-all group">
                  <span className="text-[#e28a00] flex justify-center">{t.icon}</span>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{t.label}</p>
                  <p className="text-xs font-bold text-[#08162d] group-hover:text-[#e28a00] transition-colors truncate">{t.value}</p>
                </a>
              ))}
            </div>

            {/* Info strip */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { icon: "⏰", title: "Working Hours",  sub: "Mon – Sat: 9 AM – 7 PM" },
                { icon: "📍", title: "Visit Us",       sub: "Indirapuram, Ghaziabad" },
                { icon: "💬", title: "Response Time",  sub: "Within 24 working hrs"  },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-3 text-center space-y-1">
                  <div className="text-xl">{item.icon}</div>
                  <p className="font-extrabold text-[#08162d] text-[11px]">{item.title}</p>
                  <p className="text-slate-400 text-[10px] leading-snug">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8" style={{ boxShadow: "0 4px 16px rgba(8,22,45,0.08)" }}>
            <div className="mb-6">
              <p className="text-[#e28a00] text-xs font-extrabold uppercase tracking-widest mb-1">Get In Touch</p>
              <h2 className="text-2xl font-black text-[#08162d]">We&apos;re Here to Help and Ready</h2>
            </div>

            {status === "success" ? (
              <div className="py-14 text-center space-y-3">
                <div className="text-5xl">✅</div>
                <h3 className="text-xl font-extrabold text-[#08162d]">Message Sent!</h3>
                <p className="text-slate-500 text-sm">Thank you for reaching out. Our team will respond within 24 hours.</p>
                <button onClick={() => setStatus("idle")} className="text-xs text-[#e28a00] font-bold hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-2 gap-3">
                  <input required name="firstName" placeholder="First Name *" className={inputCls} value={form.firstName} onChange={handleChange} />
                  <input required name="lastName"  placeholder="Last Name *"  className={inputCls} value={form.lastName}  onChange={handleChange} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input required name="phone" type="tel"   placeholder="Phone No. *"      className={inputCls} value={form.phone} onChange={handleChange} maxLength={10} />
                  <input required name="email" type="email" placeholder="Email Address *"  className={inputCls} value={form.email} onChange={handleChange} />
                </div>
                <textarea name="message" rows={5} placeholder="Write your message here…"
                  className={`${inputCls} resize-none`} value={form.message} onChange={handleChange} />

                {status === "error" && (
                  <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-medium">
                    Something went wrong. Please try again or call us directly.
                  </p>
                )}

                <button type="submit" disabled={status === "loading"}
                  className="w-full text-white font-extrabold py-3.5 rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ backgroundColor: "#e28a00", boxShadow: "0 6px 20px rgba(226,138,0,0.30)" }}>
                  {status === "loading" ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg> Sending…</>
                  ) : <><SendIcon /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

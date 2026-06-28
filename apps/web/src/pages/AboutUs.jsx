import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "../lib/api";

/* ── Page Banner ─────────────────────────────────────────────────── */
const PageBanner = ({ title, crumb }) => (
  <section className="hero-bg py-14 px-6 md:px-10 text-center">
    <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{title}</h1>
    <p className="text-white/50 text-sm font-medium">
      <Link to="/" className="hover:text-amber transition-colors">Home</Link>
      <span className="mx-2 text-white/30">//</span>
      <span className="text-white/70">{crumb}</span>
    </p>
  </section>
);

/* ── Data ─────────────────────────────────────────────────────────── */
const whyChooseUs = [
  { icon: "🏗️", title: "Modern Infrastructure", desc: "Great classrooms, advanced labs, and vibrant student spaces designed for the 21st-century learner." },
  { icon: "👨‍🏫", title: "Experienced Faculty", desc: "Learn from expert educators with real-world and academic knowledge, ensuring holistic development." },
  { icon: "📚", title: "Career-Oriented Programs", desc: "Get industry-focused training, workshops, and internships that align with market demands." },
  { icon: "📱", title: "Student-Centric Environment", desc: "Experience mentoring and inclusive learning for every student, everywhere." },
];

const FALLBACK_REVIEWS = [
  { review: "College Dakhla helped me compare different colleges for my MBA program. I could see fees, placements, and reviews all in one place.", studentName: "Asie Rose", role: "MBA Student" },
  { review: "What I liked most about College Dakhla is the transparency. They provided complete details about colleges and courses with no hidden information.", studentName: "Ruksana Rumi", role: "Student" },
  { review: "Thanks to College Dakhla, I got into one of the top commerce colleges. Their team supported me throughout the admission process.", studentName: "Arjun Deshpande", role: "Commerce Student" },
];

/* ═══════════════════════════════════════════════════════════════════
   ABOUT US PAGE
═══════════════════════════════════════════════════════════════════ */
const AboutUs = () => {
  const { data } = useQuery({ queryKey: ["about-testimonials"], queryFn: () => getTestimonials({ limit: 6 }) });
  const testimonials = data?.items?.length > 0 ? data.items : FALLBACK_REVIEWS;

  return (
    <div>
      <PageBanner title="About Us" crumb="About Us" />

      {/* ── WHO WE ARE ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="bg-navy rounded-3xl p-10 text-white shadow-glow max-w-xs">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "25+", label: "Years of Experience" },
                  { value: "45+", label: "Awards Winning" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-4xl font-black text-amber">{s.value}</div>
                    <div className="text-white/60 text-sm mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-amber/10 rounded-2xl border-2 border-amber/20 hidden lg:block" />
          </div>

          <div className="space-y-5">
            <p className="text-amber text-xs font-extrabold uppercase tracking-widest">Who We Are</p>
            <h2 className="text-2xl md:text-3xl font-black text-navy leading-tight">
              Built on Trust: Discovery &amp; Admissions
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              College Dakhla is an upcoming, one-of-its-kind educational portal designed to simplify
              and empower the journey of students, parents, and institutions in the higher education
              ecosystem. Our mission is to become a trusted guide for students aspiring to pursue
              undergraduate, postgraduate, and professional courses.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              At College Dakhla, we bring together comprehensive information, enabling students to
              make informed decisions about their academic future. We offer personalised guidance
              through expert counselling, test search processes, and admission facilitation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-amber hover:bg-[#c67900] text-white font-extrabold px-7 py-3 rounded-full text-sm transition-all shadow-amber active:scale-95"
            >
              Get In Touch →
            </Link>
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ──────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-10 bg-mist">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            {
              icon: "🔭",
              title: "Our Vision",
              text: "College Dakhla envisions becoming a trusted and comprehensive platform that simplifies the college admission journey for students across India. We aim to empower students to make informed decisions by providing clear, accurate, and accessible information, helping them achieve their academic and career goals with confidence.",
            },
            {
              icon: "🎯",
              title: "Our Mission",
              text: "Our mission is to guide students through every step of the admission process by offering reliable resources, expert support, and detailed insights into colleges, courses, and accreditations. We are committed to bridging the gap between students and institutions by ensuring transparency, accessibility, and a student-centric approach to educational planning.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-200 rounded-2xl p-7 space-y-4">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="text-lg font-black text-navy">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <p className="text-amber text-xs font-extrabold uppercase tracking-widest">Why Choose Us</p>
            <h2 className="text-2xl md:text-3xl font-black text-navy">
              Platform Built on True Placements
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="bg-mist border border-slate-200 rounded-2xl p-6 text-center space-y-3 hover:border-amber/40 hover:shadow-md transition-all">
                <div className="text-3xl">{item.icon}</div>
                <h4 className="font-extrabold text-navy text-sm">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDENT REVIEWS (DYNAMIC TESTIMONIALS FROM ADMIN PANEL) ──── */}
      <section className="py-16 px-6 md:px-10 bg-mist">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <p className="text-amber text-xs font-extrabold uppercase tracking-widest">Feedback</p>
            <h2 className="text-2xl md:text-3xl font-black text-navy">Our Students Reviews</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((r, i) => (
              <div key={r._id || i} className="bg-white border border-slate-200 rounded-2xl p-7 space-y-4 hover:shadow-md transition-all">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg key={idx} className="w-4 h-4 text-amber" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">&ldquo;{r.review || r.text}&rdquo;</p>
                <div>
                  <p className="font-extrabold text-navy text-sm">{r.studentName || r.name}</p>
                  <p className="text-xs text-slate-400">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

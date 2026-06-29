import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../lib/api";

/* ── Page Banner ─────────────────────────────────────────────────── */
const PageBanner = () => (
  <section className="bg-gradient-to-r from-[#08162d] to-[#0f2343] py-14 px-6 md:px-10 text-center text-white">
    <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">Educational Blogs &amp; News</h1>
    <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
      Stay informed with real-time exam alerts, college admission counselling guides, and industry placement reports.
    </p>
    <p className="text-slate-400 text-xs mt-3 font-medium">
      <Link to="/" className="hover:text-[#e28a00]">Home</Link>
      <span className="mx-2">//</span>Blogs
    </p>
  </section>
);

/* ── Icons ───────────────────────────────────────────────────────── */
const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 16 14" />
  </svg>
);
const ArrowRight = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const CATEGORIES = ["All", "Exam Alerts", "College Alerts", "Admission Alerts", "Design", "Engineering", "Career", "Technology"];

const fmtDate = (d) => {
  if (!d) return "Recently Published";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
};

/* ═══════════════════════════════════════════════════════════════════
   BLOGS PAGE
═══════════════════════════════════════════════════════════════════ */
const Blogs = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["public-blogs"],
    queryFn: () => getBlogs({ limit: 50 }),
    staleTime: 60000,
  });

  const apiBlogs = data?.items || [];

  const filtered = activeCategory === "All"
    ? apiBlogs
    : apiBlogs.filter((b) => (b.blogCategory || b.category || "").toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      <PageBanner />

      {/* Category filter pills */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-10 py-4 sticky top-[61px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-extrabold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#08162d] text-white border-[#08162d] shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#e28a00] hover:text-[#e28a00]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <section className="py-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 animate-pulse space-y-4 border border-slate-200">
                  <div className="h-44 bg-slate-200 rounded-xl w-full" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((blog, idx) => {
                const cat = blog.blogCategory || blog.category || "General";
                const dateStr = fmtDate(blog.publishDate || blog.createdAt);
                const desc = stripHtml(blog.blogDescription || blog.excerpt || blog.description || "");
                const img = blog.featuredImage || blog.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80";

                return (
                  <article
                    key={blog._id || idx}
                    onClick={() => setSelectedBlog(blog)}
                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative bg-slate-800 h-48 overflow-hidden">
                        <img
                          src={img}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                        <div className="absolute top-3 left-3 bg-[#08162d]/90 text-[#e28a00] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                          {cat}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                          <span className="flex items-center gap-1.5"><CalendarIcon /> {dateStr}</span>
                          <span>By {blog.author || "Editorial Desk"}</span>
                        </div>

                        <h2 className="text-base font-black text-[#08162d] leading-snug group-hover:text-[#e28a00] transition-colors line-clamp-2">
                          {blog.title}
                        </h2>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">
                          {desc}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#e28a00]">
                      <span>Read Full Article</span>
                      <ArrowRight />
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div className="py-20 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl max-w-xl mx-auto p-8">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="font-black text-xl text-[#08162d]">No blogs found in "{activeCategory}"</h3>
              <p className="text-xs text-slate-400 mt-1">Try selecting another category or resetting filters.</p>
              <button onClick={() => setActiveCategory("All")} className="mt-4 text-xs font-bold bg-[#e28a00] text-white px-5 py-2.5 rounded-xl hover:bg-[#c67900] transition-all">
                Show All Blogs
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── DETAILED BLOG MODAL ─────────────────────────────────────── */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center transition-all z-10"
            >
              ✕
            </button>

            <div className="space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-50 text-[#e28a00] px-3 py-1 rounded-full border border-amber-200 inline-block">
                {selectedBlog.blogCategory || "General"}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#08162d] leading-tight">{selectedBlog.title}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold border-b border-slate-100 pb-4">
                <span>🗓 Published: {fmtDate(selectedBlog.publishDate || selectedBlog.createdAt)}</span>
                <span>✍ Author: {selectedBlog.author || "Editorial Desk"}</span>
              </div>
            </div>

            {selectedBlog.featuredImage && (
              <div className="rounded-2xl overflow-hidden max-h-72 border border-slate-200">
                <img src={selectedBlog.featuredImage} alt={selectedBlog.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-4 text-slate-700 text-sm leading-relaxed font-medium">
              {selectedBlog.blogDescription && (
                <div className="bg-slate-50 border-l-4 border-[#e28a00] p-4 rounded-r-2xl italic text-slate-800 font-semibold">
                  &ldquo;{stripHtml(selectedBlog.blogDescription)}&rdquo;
                </div>
              )}
              <div className="space-y-3 prose max-w-none">
                {selectedBlog.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                ) : selectedBlog.blogDescription ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedBlog.blogDescription }} />
                ) : (
                  "No detailed body content provided."
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBlog(null)}
                className="bg-[#08162d] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs hover:bg-[#0f2343] transition-all"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;

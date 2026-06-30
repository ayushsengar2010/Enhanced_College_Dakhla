import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogById, createBlog, updateBlog } from "../lib/api";
import RichTextEditor from "../components/ui/RichTextEditor";

const CATEGORIES = [
  "Exam Alerts", "College Alerts", "Admission Alerts",
  "Design", "Engineering", "Career", "Technology", "General",
];

const AdminBlogForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" || Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Exam Alerts",
    publishDate: "",
    featuredImage: "",
    metaTitle: "",
    authorName: "College Dakhla Team",
    metaDescription: "",
    blogDescription: "",
    status: "Published",
    tags: "",
    isFeatured: false,
    featuredOrder: 0,
    metaKeywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getBlogById(id)
        .then((data) => {
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            category: data.blogCategory || data.category || "Exam Alerts",
            publishDate: data.publishDate ? new Date(data.publishDate).toISOString().split("T")[0] : "",
            featuredImage: data.coverImage || data.featuredImage || "",
            metaTitle: data.metaTitle || "",
            authorName: data.authorName || data.author || "College Dakhla Team",
            metaDescription: data.metaDescription || "",
            blogDescription: data.blogDescription || data.content || "",
            status: data.status || "Published",
            tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
            isFeatured: data.isFeatured || false,
            featuredOrder: data.featuredOrder ?? 0,
            metaKeywords: data.metaKeywords || "",
            canonicalUrl: data.canonicalUrl || "",
            ogTitle: data.ogTitle || "",
            ogDescription: data.ogDescription || "",
            ogImage: data.ogImage || "",
          });
        })
        .catch((err) => console.error("Error loading blog:", err));
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "title" && !isEdit) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Please enter Blog Title!");
      return;
    }
    setLoading(true);
    try {
      const tagsArr = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        blogCategory: formData.category,
        author: formData.authorName,
        authorName: formData.authorName,
        publishDate: formData.publishDate || null,
        coverImage: formData.featuredImage || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
        featuredImage: formData.featuredImage,
        content: formData.blogDescription || "Detailed article content...",
        blogDescription: formData.blogDescription,
        status: formData.status,
        isFeatured: formData.isFeatured,
        featuredOrder: Number(formData.featuredOrder) || 0,
        tags: tagsArr,
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.blogDescription?.replace(/<[^>]*>/g, "").substring(0, 160),
        metaKeywords: formData.metaKeywords,
        canonicalUrl: formData.canonicalUrl,
        ogTitle: formData.ogTitle || formData.metaTitle || formData.title,
        ogDescription: formData.ogDescription || formData.metaDescription,
        ogImage: formData.ogImage || formData.featuredImage,
        readTime: `${Math.max(1, Math.ceil((formData.blogDescription?.replace(/<[^>]*>/g, "").length || 0) / 500))} Min Read`,
      };

      if (isEdit) {
        await updateBlog(id, payload);
      } else {
        await createBlog(payload);
      }
      navigate("/admin/blogs");
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Failed to save blog post: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ≡ {isEdit ? "Edit Blog" : "Add Blog"}
        </h1>
        <button
          onClick={() => navigate("/admin/blogs")}
          className="text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          ← Back to List
        </button>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Golden Brown Header Banner */}
        <div className="bg-[#c58237] text-white py-3.5 px-6 font-black text-base tracking-wide text-center uppercase">
          {isEdit ? "EDIT BLOG" : "ADD BLOG"}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* ── Basic Info ── */}
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-4 pb-2 border-b border-slate-200">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Blog Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Slug</label>
                <input
                  type="text"
                  name="slug"
                  placeholder="auto-generated-from-title"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Author Name</label>
                <input
                  type="text"
                  name="authorName"
                  placeholder="Enter Author Name"
                  value={formData.authorName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Publish Date</label>
                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                >
                  <option value="Published">Published</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Featured Image URL</label>
                <input
                  type="text"
                  name="featuredImage"
                  placeholder="https://example.com/image.jpg"
                  value={formData.featuredImage}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt="Preview"
                    className="mt-2 h-24 w-auto rounded-lg border border-slate-200 object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── Tags & Featured ── */}
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-4 pb-2 border-b border-slate-200">Tags & Featured</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Tags</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="exam, college, admission, career"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Separate tags with commas</p>
              </div>
              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-[#c58237] focus:ring-[#c58237]"
                  />
                  <span className="text-xs font-bold text-slate-700">Mark as Featured Post</span>
                </label>
                {formData.isFeatured && (
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Order:</label>
                    <input
                      type="number"
                      name="featuredOrder"
                      value={formData.featuredOrder}
                      onChange={handleChange}
                      min="0"
                      className="w-16 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-center focus:outline-none focus:border-[#c58237]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SEO Meta ── */}
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-4 pb-2 border-b border-slate-200">SEO & Social Meta</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  placeholder="SEO title (defaults to blog title)"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Meta Keywords</label>
                <input
                  type="text"
                  name="metaKeywords"
                  placeholder="exam alerts, college news, career"
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Meta Description</label>
                <textarea
                  rows={2}
                  name="metaDescription"
                  placeholder="Brief description for search engines (150-160 chars recommended)"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Canonical URL</label>
                <input
                  type="text"
                  name="canonicalUrl"
                  placeholder="https://collegedakhla.com/blogs/your-post-slug"
                  value={formData.canonicalUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>

              {/* Open Graph fields */}
              <div className="md:col-span-2 border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Open Graph (Social Sharing)</p>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">OG Title</label>
                <input
                  type="text"
                  name="ogTitle"
                  placeholder="Title shown on social shares"
                  value={formData.ogTitle}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">OG Image URL</label>
                <input
                  type="text"
                  name="ogImage"
                  placeholder="Image shown on social shares"
                  value={formData.ogImage}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">OG Description</label>
                <textarea
                  rows={2}
                  name="ogDescription"
                  placeholder="Description shown on social shares"
                  value={formData.ogDescription}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                />
              </div>
            </div>
          </div>

          {/* ── Blog Content ── */}
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-4 pb-2 border-b border-slate-200">Blog Content</h3>
            <RichTextEditor
              value={formData.blogDescription}
              onChange={(value) => setFormData((prev) => ({ ...prev, blogDescription: value }))}
              placeholder="Enter detailed blog post article content..."
            />
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-8 py-3 rounded-xl shadow-md transition-all min-w-[120px]"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/blogs")}
              className="bg-slate-600 hover:bg-slate-700 text-white font-extrabold text-xs px-8 py-3 rounded-xl shadow-md transition-all min-w-[120px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogForm;

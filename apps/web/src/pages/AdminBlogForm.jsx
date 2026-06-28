import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogById, createBlog, updateBlog } from "../lib/api";
import RichTextEditor from "../components/ui/RichTextEditor";

const AdminBlogForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" || Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    publishDate: "",
    featuredImage: "",
    metaTitle: "",
    authorName: "College Dakhla Team",
    metaDescription: "",
    blogDescription: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getBlogById(id)
        .then((data) => {
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            publishDate: data.publishDate ? new Date(data.publishDate).toISOString().split("T")[0] : "",
            featuredImage: data.coverImage || data.featuredImage || "",
            metaTitle: data.metaTitle || "",
            authorName: data.authorName || data.author || "College Dakhla Team",
            metaDescription: data.metaDescription || "",
            blogDescription: data.blogDescription || data.content || "",
            status: data.status || "Active",
          });
        })
        .catch((err) => console.error("Error loading blog:", err));
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
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
      const payload = {
        ...formData,
        publishDate: formData.publishDate || null,
        coverImage: formData.featuredImage || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
        content: formData.blogDescription || "Detailed article content...",
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

      {/* Main Form Container matching Screenshot 4 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Golden Brown Header Banner */}
        <div className="bg-[#c58237] text-white py-3.5 px-6 font-black text-base tracking-wide text-center uppercase">
          {isEdit ? "EDIT BLOG" : "ADD BLOG"}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Title</label>
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

            {/* Slug */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Slug</label>
              <input
                type="text"
                name="slug"
                placeholder="Slug Here"
                value={formData.slug}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Publish Date */}
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

            {/* Featured Image */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Featured Image</label>
              <input
                type="text"
                name="featuredImage"
                placeholder="Paste Image URL or choose file"
                value={formData.featuredImage}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                placeholder="Enter Meta Title"
                value={formData.metaTitle}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Author Name */}
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

            {/* Meta Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Meta Description</label>
              <textarea
                rows={3}
                name="metaDescription"
                placeholder="Enter Meta Description"
                value={formData.metaDescription}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>
          </div>

          {/* Blog Description WYSIWYG Editor */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Blog Description</label>
            <RichTextEditor
              value={formData.blogDescription}
              onChange={(value) => setFormData((prev) => ({ ...prev, blogDescription: value }))}
              placeholder="Enter detailed blog post article content..."
            />
          </div>

          {/* Action Buttons matching Screenshot 4 */}
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

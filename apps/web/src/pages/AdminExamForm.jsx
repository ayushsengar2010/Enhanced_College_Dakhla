import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById, createExam, updateExam } from "../lib/api";
import RichTextEditor from "../components/ui/RichTextEditor";

const AdminExamForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" || Boolean(id);

  const [formData, setFormData] = useState({
    examName: "",
    slug: "",
    examDate: "",
    examLevel: "National",
    examMode: "Online",
    participatingCollegesCount: 10,
    applicationLink: "https://www.collegedakhla.com/",
    status: "Active",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getExamById(id)
        .then((data) => {
          setFormData({
            examName: data.examName || "",
            slug: data.slug || "",
            examDate: data.examDate ? new Date(data.examDate).toISOString().split("T")[0] : "",
            examLevel: data.examLevel || "National",
            examMode: data.examMode || "Online",
            participatingCollegesCount: data.participatingCollegesCount || 10,
            applicationLink: data.applicationLink || "https://www.collegedakhla.com/",
            status: data.status || "Active",
            description: data.description || "",
          });
        })
        .catch((err) => console.error("Error loading exam:", err));
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "examName" && !isEdit) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.examName) {
      alert("Please enter Exam Name!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        examDate: formData.examDate || null,
      };
      if (isEdit) {
        await updateExam(id, payload);
      } else {
        await createExam(payload);
      }
      navigate("/admin/exams");
    } catch (err) {
      console.error("Error saving exam:", err);
      alert("Failed to save entrance exam: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ≡ {isEdit ? "Edit Entrance Exam" : "Add Entrance Exam"}
        </h1>
        <button
          onClick={() => navigate("/admin/exams")}
          className="text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          ← Back to List
        </button>
      </div>

      {/* Main Form Container matching Screenshot 3 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Golden Brown Header Banner */}
        <div className="bg-[#c58237] text-white py-3.5 px-6 font-black text-base tracking-wide text-center uppercase">
          {isEdit ? "EDIT ENTRANCE EXAM" : "ADD ENTRANCE EXAM"}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Exam Name */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Exam Name</label>
              <input
                type="text"
                name="examName"
                placeholder="Enter Exam Name"
                value={formData.examName}
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
                placeholder="Enter Slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Exam Date */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Exam Date</label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Exam Level */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Exam Level</label>
              <input
                type="text"
                name="examLevel"
                placeholder="Enter Exam Level (e.g. National, Telangana)"
                value={formData.examLevel}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Exam Mode */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Exam Mode</label>
              <input
                type="text"
                name="examMode"
                placeholder="Enter Exam Mode (e.g. Online, Offline)"
                value={formData.examMode}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Participating College */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">No Of Participated College</label>
              <input
                type="number"
                name="participatingCollegesCount"
                placeholder="(Enter in Number eg :- 1595)"
                value={formData.participatingCollegesCount}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Application Link */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Application Link</label>
              <input
                type="text"
                name="applicationLink"
                placeholder="https://www.collegedakhla.com/"
                value={formData.applicationLink}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Description WYSIWYG Editor */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Description</label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              placeholder="Enter detailed exam syllabus and description..."
            />
          </div>

          {/* Action Buttons matching Screenshot 3 */}
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
              onClick={() => navigate("/admin/exams")}
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

export default AdminExamForm;

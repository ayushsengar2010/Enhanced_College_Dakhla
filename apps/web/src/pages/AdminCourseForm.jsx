import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourses, createCourse, updateCourse } from "../lib/api";

const AdminCourseForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" || Boolean(id);

  const [formData, setFormData] = useState({
    stream: "Science",
    subStream: "Computer Science and Business Systems",
    courseType: "Bachelors",
    courseName: "",
    courseReview: "4.8/5",
    entranceExam: "CET",
    duration: "3 Years",
    courseLevel: "UG",
    feeAmount: "220000/Yr",
    status: "Active",
    description: "",
    eligibility: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getCourses()
        .then((res) => {
          const found = (res.items || []).find((c) => c._id === id);
          if (found) {
            setFormData({
              stream: found.stream || "Science",
              subStream: found.subStream || "Computer Science and Business Systems",
              courseType: found.courseType || "Bachelors",
              courseName: found.courseName || "",
              courseReview: found.courseReview || "4.8/5",
              entranceExam: found.entranceExam || "CET",
              duration: found.duration || "3 Years",
              courseLevel: found.courseLevel || "UG",
              feeAmount: found.feeAmount || (found.fees ? `${found.fees}/Yr` : "220000/Yr"),
              status: found.status || "Active",
              description: found.description || "",
              eligibility: found.eligibility || "",
            });
          }
        })
        .catch((err) => console.error("Error loading course:", err));
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseName) {
      alert("Please enter Course Name!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        fees: parseInt(formData.feeAmount.replace(/\D/g, ""), 10) || 150000,
      };
      if (isEdit) {
        await updateCourse(id, payload);
      } else {
        await createCourse(payload);
      }
      navigate("/admin/courses");
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Failed to save course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ≡ {isEdit ? "Edit Course" : "Add Course"}
        </h1>
        <button
          onClick={() => navigate("/admin/courses")}
          className="text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          ← Back to List
        </button>
      </div>

      {/* Main Form Container matching Screenshot 5 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Golden Brown Header Banner */}
        <div className="bg-[#c58237] text-white py-3.5 px-6 font-black text-base tracking-wide text-center uppercase">
          {isEdit ? "EDIT COURSE" : "ADD COURSE"}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Stream Name */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Stream Name</label>
              <select
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              >
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Management">Management</option>
                <option value="Engineering">Engineering</option>
                <option value="Commerce">Commerce</option>
                <option value="Medical">Medical</option>
              </select>
            </div>

            {/* Substream Name */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Substream Name</label>
              <input
                type="text"
                name="subStream"
                placeholder="Select / Enter Substream"
                value={formData.subStream}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Course Type */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Course Type</label>
              <select
                name="courseType"
                value={formData.courseType}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              >
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="Diploma">Diploma</option>
                <option value="Postgraduate Diploma">Postgraduate Diploma</option>
              </select>
            </div>

            {/* Course Name */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Course Name</label>
              <input
                type="text"
                name="courseName"
                placeholder="Enter Course Name"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                required
              />
            </div>

            {/* Course Review */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Course Review</label>
              <input
                type="text"
                name="courseReview"
                placeholder="Enter Review (eg :- 4.9/5)"
                value={formData.courseReview}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Course Entrance Exam */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Course Entrance Exam</label>
              <input
                type="text"
                name="entranceExam"
                placeholder="Enter Entrance Exam"
                value={formData.entranceExam}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Course Duration */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Course Duration</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5.5 Years">5.5 Years</option>
              </select>
            </div>

            {/* Course Level */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Course level</label>
              <select
                name="courseLevel"
                value={formData.courseLevel}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              >
                <option value="UG">UG (Undergraduate)</option>
                <option value="PG">PG (Postgraduate)</option>
                <option value="Diploma">Diploma</option>
                <option value="Doctorate">Doctorate</option>
              </select>
            </div>

            {/* Course Fees */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Course Fees</label>
              <input
                type="text"
                name="feeAmount"
                placeholder="Select / Enter Fee Range"
                value={formData.feeAmount}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Eligibility */}
            <div className="md:col-span-3">
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Course Eligibility</label>
              <input
                type="text"
                name="eligibility"
                placeholder="Enter eligibility requirements (e.g. 10+2 with Physics, Chemistry, Mathematics)..."
                value={formData.eligibility}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>
          </div>

          {/* Description Textarea matching Screenshot 5 */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Description</label>
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
              <div className="bg-slate-200/60 px-3 py-1.5 border-b border-slate-300 flex items-center gap-3 text-xs text-slate-600 font-bold">
                <span>✂️ 📋 💾</span>
                <span>|</span>
                <span><b>B</b> <i>I</i> <u>S</u> <s>T</s></span>
                <span>|</span>
                <span>Formatting Tools</span>
              </div>
              <textarea
                rows={6}
                name="description"
                placeholder="Enter detailed course syllabus and overview..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 text-xs font-semibold text-slate-800 bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons matching Screenshot 5 */}
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
              onClick={() => navigate("/admin/courses")}
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

export default AdminCourseForm;

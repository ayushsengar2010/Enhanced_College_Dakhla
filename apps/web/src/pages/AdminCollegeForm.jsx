import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCollegeById, createCollege, updateCollege } from "../lib/api";
import RichTextEditor from "../components/ui/RichTextEditor";

const AdminCollegeForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" || Boolean(id);

  const [formData, setFormData] = useState({
    collegeName: "",
    establishedYear: "1997",
    slug: "",
    shortCode: "",
    highestPackage: "",
    location: "Ghaziabad, Uttar Pradesh",
    rankingText: "#1 out of 50 in India 2025",
    qualifyingExam: "JEE Main / UPTAC",
    cutoffScore: "JEE Main Rank ~ 5,15,000",
    applicationStart: "",
    applicationEnd: "",
    feesAmount: "110000",
    feeDescription: "1st Year Fees",
    category: "Private",
    bestFor: "Excellent research labs and placement support",
    userReviews: "3.9/5",
    rank: "10",
    scholarship: "Available",
    affiliation: "Autonomous University",
    hostelAvailability: "Available",
    collegeType: "Private",
    metaTitle: "",
    metaDescription: "",
    infoDescription: "",
    coursesFeesDescription: "",
    admissionDescription: "",
    cutoffDescription: "",
    placementDescription: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getCollegeById(id)
        .then((data) => {
          setFormData({
            collegeName: data.collegeName || "",
            establishedYear: data.establishedYear || "1997",
            slug: data.slug || "",
            shortCode: data.shortCode || data.shortName || "",
            highestPackage: data.highestPackage || "",
            location: data.location || `${data.city || ""}, ${data.state || ""}`,
            rankingText: data.bestFor || "#1 out of 50 in India 2025",
            qualifyingExam: data.qualifyingExam || data.cutoffExam || "JEE Main / UPTAC",
            cutoffScore: data.cutoffScore || "JEE Main Rank ~ 5,15,000",
            applicationStart: data.applicationStart ? new Date(data.applicationStart).toISOString().split("T")[0] : "",
            applicationEnd: data.applicationEnd ? new Date(data.applicationEnd).toISOString().split("T")[0] : "",
            feesAmount: data.feesAmount || (data.fees ? String(data.fees) : "110000"),
            feeDescription: data.feeDescription || "1st Year Fees",
            category: data.category || data.collegeType || "Private",
            bestFor: data.bestFor || "Excellent research labs and placement support",
            userReviews: data.userReviews || (data.rating ? `${data.rating}/5` : "3.9/5"),
            rank: String(data.rank || data.ranking || 10),
            scholarship: data.scholarship || data.scholarshipAvailable || "Available",
            affiliation: data.affiliation || "Autonomous University",
            hostelAvailability: data.hostelAvailability || "Available",
            collegeType: data.collegeType || "Private",
            metaTitle: data.metaTitle || data.seo?.title || "",
            metaDescription: data.metaDescription || data.seo?.description || "",
            infoDescription: data.infoDescription || data.sections?.about || "",
            coursesFeesDescription: data.coursesFeesDescription || data.sections?.coursesFees || "",
            admissionDescription: data.admissionDescription || data.sections?.admissionProcess || "",
            cutoffDescription: data.cutoffDescription || data.sections?.cutoff || "",
            placementDescription: data.placementDescription || data.sections?.placements || "",
            status: data.status || "Active",
          });
        })
        .catch((err) => console.error("Error loading college:", err));
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "collegeName" && !isEdit) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.collegeName) {
      alert("Please enter College Name!");
      return;
    }
    setLoading(true);
    try {
      const locParts = formData.location.split(",");

      // Build a clean payload — avoid sending empty strings to Date fields
      // (Mongoose throws CastError for new Date(""))
      const payload = {
        collegeName:          formData.collegeName,
        slug:                formData.slug || undefined,
        shortCode:           formData.shortCode || undefined,
        highestPackage:      formData.highestPackage || undefined,
        location:            formData.location || undefined,
        establishedYear:     formData.establishedYear || undefined,
        rankingText:         formData.rankingText || undefined,
        qualifyingExam:      formData.qualifyingExam || undefined,
        cutoffScore:         formData.cutoffScore || undefined,
        applicationStart:    formData.applicationStart || null,
        applicationEnd:      formData.applicationEnd || null,
        feesAmount:          formData.feesAmount || undefined,
        feeDescription:      formData.feeDescription || undefined,
        category:            formData.category || undefined,
        bestFor:             formData.bestFor || undefined,
        userReviews:         formData.userReviews || undefined,
        rank:                formData.rank || undefined,
        scholarship:         formData.scholarship || undefined,
        affiliation:         formData.affiliation || undefined,
        hostelAvailability:  formData.hostelAvailability || undefined,
        collegeType:         formData.collegeType || undefined,
        metaTitle:           formData.metaTitle || undefined,
        metaDescription:     formData.metaDescription || undefined,
        infoDescription:     formData.infoDescription || undefined,
        coursesFeesDescription:  formData.coursesFeesDescription || undefined,
        admissionDescription:    formData.admissionDescription || undefined,
        cutoffDescription:       formData.cutoffDescription || undefined,
        placementDescription:    formData.placementDescription || undefined,
        status:              formData.status || "Active",

        city:   locParts[0]?.trim() || "Ghaziabad",
        state:  locParts[1]?.trim() || "Uttar Pradesh",
        fees:   parseInt(formData.feesAmount.replace(/\D/g, ""), 10) || 110000,
        ranking: parseInt(formData.rank, 10) || 10,

        sections: {
          about:        formData.infoDescription || "",
          coursesFees:  formData.coursesFeesDescription || "",
          admissionProcess: formData.admissionDescription || "",
          cutoff:       formData.cutoffDescription || "",
          placements:   formData.placementDescription || "",
        },
        seo: {
          title:       formData.metaTitle || "",
          description: formData.metaDescription || "",
        }
      };

      if (isEdit) {
        await updateCollege(id, payload);
      } else {
        await createCollege(payload);
      }
      navigate("/admin/colleges");
    } catch (err) {
      console.error("Error saving college:", err);
      // Show the actual server error message instead of a generic one
      const serverMsg = err.response?.data?.message || err.message || "Failed to save college.";
      alert(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ≡ {isEdit ? "Edit College" : "Add College"}
        </h1>
        <button
          onClick={() => navigate("/admin/colleges")}
          className="text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          ← Back to List
        </button>
      </div>

      {/* Main Form Container matching Screenshot 2 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Golden Brown Header Banner */}
        <div className="bg-[#c58237] text-white py-3.5 px-6 font-black text-base tracking-wide text-center uppercase">
          {isEdit ? "EDIT COLLEGE" : "ADD COLLEGE"}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {/* Full-width Course List field */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Course List</label>
            <input
              type="text"
              placeholder="Select or enter courses associated with this college..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* College Name */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">College Name</label>
              <input
                type="text"
                name="collegeName"
                placeholder="Enter College Name"
                value={formData.collegeName}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
                required
              />
            </div>

            {/* Establish Year */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Establish Year</label>
              <input
                type="text"
                name="establishedYear"
                placeholder="Enter Establish Year (eg :- 1997)"
                value={formData.establishedYear}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
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

            {/* Short Code */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Short Code</label>
              <input
                type="text"
                name="shortCode"
                placeholder="Enter Short Code (eg :- 154466)"
                value={formData.shortCode}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Highest Package */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Highest Package</label>
              <input
                type="text"
                name="highestPackage"
                placeholder="Enter Highest Package (eg :- 18 LPA)"
                value={formData.highestPackage}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter Location (eg :- Chennai, TN)"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Ranking Text */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Ranking Text</label>
              <input
                type="text"
                name="rankingText"
                placeholder="Enter Ranking Text (eg :- #1 out of 50 in India 2025)"
                value={formData.rankingText}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Qualifying Exam */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Qualifying Exam</label>
              <input
                type="text"
                name="qualifyingExam"
                placeholder="Enter Qualifying Exam (eg :- GATE 2025 Cut off 325)"
                value={formData.qualifyingExam}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Cutoff Score */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Cutoff Score</label>
              <input
                type="text"
                name="cutoffScore"
                placeholder="Enter Cutoff Score (eg :- 320)"
                value={formData.cutoffScore}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Application Start */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Application Start</label>
              <input
                type="date"
                name="applicationStart"
                value={formData.applicationStart}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Application End */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Application End</label>
              <input
                type="date"
                name="applicationEnd"
                value={formData.applicationEnd}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Fees Amount */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Fees Amount</label>
              <input
                type="text"
                name="feesAmount"
                placeholder="Enter Fees Amount (eg :- 85000)"
                value={formData.feesAmount}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Fee Description */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Fee Description</label>
              <input
                type="text"
                name="feeDescription"
                placeholder="Enter Fees Description (eg :- 1st Year Fees)"
                value={formData.feeDescription}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Category</label>
              <input
                type="text"
                name="category"
                placeholder="Enter Category (eg :- Private, Government)"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Best for */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Best for</label>
              <input
                type="text"
                name="bestFor"
                placeholder="Enter Best for eg :- (Excellent research labs)"
                value={formData.bestFor}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* User Reviews */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">User Reviews</label>
              <input
                type="text"
                name="userReviews"
                placeholder="Enter User Reviews (eg :- 4.9/5)"
                value={formData.userReviews}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Rank */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Rank</label>
              <input
                type="text"
                name="rank"
                placeholder="Enter Rank (eg :- 1)"
                value={formData.rank}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Scholarship */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Scholarship</label>
              <select
                name="scholarship"
                value={formData.scholarship}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            {/* Affiliated */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Affiliated (eg: University)</label>
              <input
                type="text"
                name="affiliation"
                placeholder="Autonomous University / State Univ"
                value={formData.affiliation}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>

            {/* Hostel Availability */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Hostel Availability</label>
              <select
                name="hostelAvailability"
                value={formData.hostelAvailability}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            {/* College/Universities */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">College/Universities</label>
              <select
                name="collegeType"
                value={formData.collegeType}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              >
                <option value="Private">Private</option>
                <option value="Government">Government</option>
                <option value="Government Aided">Government Aided</option>
                <option value="Private University">Private University</option>
              </select>
            </div>
          </div>

          {/* Meta Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                placeholder="Meta Title"
                value={formData.metaTitle}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Meta Description</label>
              <input
                type="text"
                name="metaDescription"
                placeholder="Meta Description"
                value={formData.metaDescription}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c58237]"
              />
            </div>
          </div>

          {/* Rich Text Content Editors with WYSIWYG */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Info Description</label>
              <RichTextEditor
                value={formData.infoDescription}
                onChange={(value) => setFormData((prev) => ({ ...prev, infoDescription: value }))}
                placeholder="General overview and about college info..."
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Courses and Fees Description</label>
              <RichTextEditor
                value={formData.coursesFeesDescription}
                onChange={(value) => setFormData((prev) => ({ ...prev, coursesFeesDescription: value }))}
                placeholder="Detailed breakdown of offered degree programs and annual tuition..."
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Admission Description</label>
              <RichTextEditor
                value={formData.admissionDescription}
                onChange={(value) => setFormData((prev) => ({ ...prev, admissionDescription: value }))}
                placeholder="Step-by-step application process and eligibility guidelines..."
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Cutoff Description</label>
              <RichTextEditor
                value={formData.cutoffDescription}
                onChange={(value) => setFormData((prev) => ({ ...prev, cutoffDescription: value }))}
                placeholder="Opening & closing rank requirements across entrance exams..."
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">Placement Description</label>
              <RichTextEditor
                value={formData.placementDescription}
                onChange={(value) => setFormData((prev) => ({ ...prev, placementDescription: value }))}
                placeholder="Placement CTC statistics and top visiting recruiters..."
              />
            </div>
          </div>

          {/* Action Buttons matching Screenshot 2 */}
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
              onClick={() => navigate("/admin/colleges")}
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

export default AdminCollegeForm;

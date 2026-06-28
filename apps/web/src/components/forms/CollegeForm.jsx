import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const defaultSections = {
  about: "",
  coursesFees: "",
  admissionProcess: "",
  eligibility: "",
  cutoff: "",
  placements: "",
  hostel: "",
  reviews: "",
  scholarships: "",
  faqs: ""
};

const CollegeForm = ({ initialData, courses = [], onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    collegeName: "",
    slug: "",
    shortName: "",
    logo: "",
    bannerImage: "",
    brochureUrl: "",
    state: "",
    city: "",
    establishedYear: "",
    collegeType: "Private",
    affiliation: "Yes",
    accreditation: "",
    ranking: "",
    rating: "",
    fees: "",
    highestPackage: "",
    averagePackage: "",
    hostelAvailability: "Yes",
    scholarshipAvailable: "Yes",
    applicationStartDate: "",
    applicationEndDate: "",
    status: "Active",
    courses: [],
    sections: defaultSections,
    seo: { title: "", description: "" }
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        courses: (initialData.courses || []).map((course) => course._id || course)
      }));
    }
  }, [initialData]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const updateSection = (field) => (value) => {
    setForm((prev) => ({ ...prev, sections: { ...prev.sections, [field]: value } }));
  };

  const toggleCourse = (courseId) => {
    setForm((prev) => {
      const exists = prev.courses.includes(courseId);
      return {
        ...prev,
        courses: exists ? prev.courses.filter((id) => id !== courseId) : [...prev.courses, courseId]
      };
    });
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-6 text-xs text-slate-700 font-medium">
      {/* 1. Course Mappings Multiselect Box */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm space-y-2">
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Course List</label>
        
        {/* Pills Display Container */}
        <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 min-h-[48px] flex flex-wrap gap-1.5 shadow-inner">
          {form.courses.length === 0 ? (
            <span className="text-[11px] text-slate-400 self-center pl-1">No courses mapped yet. Map new courses from the dropdown below.</span>
          ) : (
            form.courses.map((courseId) => {
              const courseObj = courses.find((c) => c._id === courseId || c === courseId);
              return (
                <div 
                  key={courseId} 
                  className="inline-flex items-center gap-1.5 bg-[#e2e8f0]/80 hover:bg-[#cbd5e1] border border-slate-300/40 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded shadow-sm transition-all"
                >
                  <span>{courseObj?.courseName || "Course"}</span>
                  <button
                    type="button"
                    onClick={() => toggleCourse(courseId)}
                    className="text-slate-400 hover:text-red-600 font-black ml-1 text-xs cursor-pointer transition-colors"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Dropdown to add courses */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              toggleCourse(e.target.value);
              e.target.value = ""; // Reset option
            }
          }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full bg-white shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30 transition-all"
          defaultValue=""
        >
          <option value="" disabled>+ Map a course to this college...</option>
          {courses
            .filter((c) => !form.courses.includes(c._id))
            .map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseName}
              </option>
            ))}
        </select>
      </section>

      {/* 2. Three-Column Input Fields Grid */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Row 1 */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">College Name</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.collegeName} onChange={updateField("collegeName")} required />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Establish Year</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" type="number" value={form.establishedYear} onChange={updateField("establishedYear")} />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Slug</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.slug} onChange={updateField("slug")} placeholder="Auto-generated if empty" />
        </div>

        {/* Row 2 */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Short Code</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.shortName} onChange={updateField("shortName")} />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Highest Package</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.highestPackage} onChange={updateField("highestPackage")} placeholder="e.g. 15.0 LPA" />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Location (City)</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.city} onChange={updateField("city")} required />
        </div>

        {/* Row 3 */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Location (State)</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.state} onChange={updateField("state")} required />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Ranking Test</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.accreditation} onChange={updateField("accreditation")} placeholder="e.g. Prominent technical institute" />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Qualifying Exam</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.affiliation} onChange={updateField("affiliation")} placeholder="e.g. JEE Main / NATA" />
        </div>

        {/* Row 4 */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Application Start</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" type="date" value={form.applicationStartDate ? form.applicationStartDate.split("T")[0] : ""} onChange={updateField("applicationStartDate")} />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Application End</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" type="date" value={form.applicationEndDate ? form.applicationEndDate.split("T")[0] : ""} onChange={updateField("applicationEndDate")} />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Fees Amount</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" type="number" value={form.fees} onChange={updateField("fees")} />
        </div>

        {/* Row 5 */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Fees Description</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.averagePackage} onChange={updateField("averagePackage")} placeholder="e.g. 65000 per year" />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Category</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.collegeType} onChange={updateField("collegeType")} placeholder="e.g. Private / Government" />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">
            Listing Status <span className="text-red-500 font-black">*</span>
          </label>
          <select
            className="border-2 border-ochre rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30 bg-white font-bold"
            value={form.status}
            onChange={updateField("status")}
          >
            <option value="Active">✅ Active — Visible on website</option>
            <option value="Inactive">⛔ Inactive — Hidden from website</option>
            <option value="Draft">📝 Draft — Hidden (work in progress)</option>
          </select>
          {form.status !== "Active" && (
            <p className="text-[10px] text-red-500 font-semibold mt-0.5">
              ⚠️ This college is NOT visible on the website. Set to Active to publish it.
            </p>
          )}
        </div>

        {/* Row 6 */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">User Reviews</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" type="number" step="0.1" value={form.rating} onChange={updateField("rating")} placeholder="e.g. 4.0" />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">rank</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" type="number" value={form.ranking} onChange={updateField("ranking")} />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Scholarship</label>
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30 bg-white" value={form.scholarshipAvailable} onChange={updateField("scholarshipAvailable")}>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Row 7 */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Affiliated (eg: University)</label>
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30 bg-white" value={form.scholarshipAvailable} onChange={updateField("scholarshipAvailable")}>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Hostel Availability</label>
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30 bg-white" value={form.hostelAvailability} onChange={updateField("hostelAvailability")}>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Row 8: File URLs & Previews */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-700">Upload College Image</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30 bg-white" value={form.bannerImage} onChange={updateField("bannerImage")} placeholder="Banner Image URL" />
          {form.bannerImage && (
            <div className="mt-1 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">Current Image:</span>
              <img src={form.bannerImage} alt="Banner Preview" className="h-12 w-24 object-cover rounded border border-slate-200 shadow-sm" />
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-700">College Brochure</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30 bg-white" value={form.brochureUrl} onChange={updateField("brochureUrl")} placeholder="Brochure URL" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label className="block text-[11px] font-bold text-slate-700">College Logo</label>
            <span className="text-[9px] text-rose-500 font-medium">size must be 200 x 200 pixels, Max size: 500 KB.</span>
          </div>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30 bg-white" value={form.logo} onChange={updateField("logo")} placeholder="Logo URL" />
          {form.logo && (
            <div className="mt-1 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">Current Image:</span>
              <img src={form.logo} alt="Logo Preview" className="h-10 w-10 object-contain rounded-full border border-slate-200 shadow-sm bg-white p-0.5" />
            </div>
          )}
        </div>
      </section>

      {/* 3. Rich Text Content Editors */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm space-y-6">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-l-3 border-ochre pl-2">Info Description</h3>
          <ReactQuill theme="snow" value={form.sections.about} onChange={updateSection("about")} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-l-3 border-ochre pl-2">Courses and Fees Description</h3>
          <ReactQuill theme="snow" value={form.sections.coursesFees} onChange={updateSection("coursesFees")} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-l-3 border-ochre pl-2">Admission Description</h3>
          <ReactQuill theme="snow" value={form.sections.admissionProcess} onChange={updateSection("admissionProcess")} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-l-3 border-ochre pl-2">Cutoff Description</h3>
          <ReactQuill theme="snow" value={form.sections.cutoff} onChange={updateSection("cutoff")} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-l-3 border-ochre pl-2">Placement Description</h3>
          <ReactQuill theme="snow" value={form.sections.placements} onChange={updateSection("placements")} />
        </div>
      </section>

      {/* 4. SEO Section */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Meta Title</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.seo?.title || ""} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))} />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Meta Description</label>
          <input className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full shadow-sm focus:outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30" value={form.seo?.description || ""} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))} />
        </div>
      </section>

      {/* 5. Center-Aligned Submit / Cancel Buttons */}
      <div className="flex items-center justify-center gap-4 py-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-ochre hover:bg-ochre/90 text-white font-bold px-8 py-2.5 rounded shadow transition-all duration-200 text-xs active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-[#5f6c7d] hover:bg-[#505c6a] text-white font-bold px-8 py-2.5 rounded shadow transition-all duration-200 text-xs active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CollegeForm;

import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";

// Public pages
import Home from "./pages/Home";
import CollegeList from "./pages/CollegeList";
import CollegeDetail from "./pages/CollegeDetail";
import AboutUs from "./pages/AboutUs";
import Courses from "./pages/Courses";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import DiscoverColleges from "./pages/DiscoverColleges";
import PredictorPage from "./pages/PredictorPage";
import CompareColleges from "./pages/CompareColleges";
import RoiCalculatorPage from "./pages/RoiCalculatorPage";
import CommunityPage from "./pages/CommunityPage";
import ReviewsPage from "./pages/ReviewsPage";
import ExamsPage from "./pages/ExamsPage";
import StudyMaterialPage from "./pages/StudyMaterialPage";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import AlertsPage from "./pages/AlertsPage";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminColleges from "./pages/AdminColleges";
import AdminCollegeForm from "./pages/AdminCollegeForm";
import AdminCourses from "./pages/AdminCourses";
import AdminCourseForm from "./pages/AdminCourseForm";
import AdminExams from "./pages/AdminExams";
import AdminExamForm from "./pages/AdminExamForm";
import AdminBlogs from "./pages/AdminBlogs";
import AdminBlogForm from "./pages/AdminBlogForm";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminReviews from "./pages/AdminReviews";
import AdminQuestions from "./pages/AdminQuestions";
import AdminAlerts from "./pages/AdminAlerts";
import AdminScholarships from "./pages/AdminScholarships";
import AdminStudyMaterials from "./pages/AdminStudyMaterials";
import AdminStreams from "./pages/AdminStreams";
import AdminSubstreams from "./pages/AdminSubstreams";
import AdminCourseDurations from "./pages/AdminCourseDurations";
import AdminApis from "./pages/AdminApis";
import AdminLeads from "./pages/AdminLeads";
import AdminHomeEnquiries from "./pages/AdminHomeEnquiries";
import AdminCollegeEnquiries from "./pages/AdminCollegeEnquiries";
import AdminContactEnquiries from "./pages/AdminContactEnquiries";
import AdminPredictorEnquiries from "./pages/AdminPredictorEnquiries";
import AdminLogin from "./pages/AdminLogin";
import AdminBanners from "./pages/AdminBanners";

/* Scroll to top on every route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
};

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-mist">
    <div className="bg-[#ffffff] border border-slate-200 rounded-2xl p-12 shadow-card text-center space-y-4 max-w-sm">
      <div className="text-5xl">🔍</div>
      <h1 className="text-2xl font-black text-navy">Page Not Found</h1>
      <p className="text-slate-500 text-sm">The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" className="inline-block bg-[#e28a00] hover:bg-[#c67900] text-[#ffffff] font-extrabold px-6 py-3 rounded-full text-sm transition-all shadow-lg">
        Back to Home
      </a>
    </div>
  </div>
);

const App = () => (
  <>
    <ScrollToTop />
    <Routes>
      {/* ── Public Routes ─────────────────────────────────────── */}
      <Route element={<PublicRoutes />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="courses" element={<Courses />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<Blogs />} />
        <Route path="contact" element={<Contact />} />
        
        {/* Module Routes */}
        <Route path="colleges" element={<CollegeList />} />
        <Route path="college/:slug" element={<CollegeDetail />} />
        <Route path="discover" element={<DiscoverColleges />} />
        <Route path="predictor" element={<PredictorPage />} />
        <Route path="compare" element={<CompareColleges />} />
        <Route path="roi-calculator" element={<RoiCalculatorPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="study-material" element={<StudyMaterialPage />} />
        <Route path="scholarships" element={<ScholarshipsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
      </Route>

      {/* ── Admin Routes ──────────────────────────────────────── */}
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<AdminRoutes />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="colleges" element={<AdminColleges />} />
        <Route path="colleges/new" element={<AdminCollegeForm mode="create" />} />
        <Route path="colleges/:id" element={<AdminCollegeForm mode="edit" />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="courses/new" element={<AdminCourseForm mode="create" />} />
        <Route path="courses/:id" element={<AdminCourseForm mode="edit" />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="exams/new" element={<AdminExamForm mode="create" />} />
        <Route path="exams/:id" element={<AdminExamForm mode="edit" />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="blogs/new" element={<AdminBlogForm mode="create" />} />
        <Route path="blogs/:id" element={<AdminBlogForm mode="edit" />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="alerts" element={<AdminAlerts />} />
        <Route path="scholarships" element={<AdminScholarships />} />
        <Route path="study-material" element={<AdminStudyMaterials />} />
        <Route path="streams" element={<AdminStreams />} />
        <Route path="substreams" element={<AdminSubstreams />} />
        <Route path="course-durations" element={<AdminCourseDurations />} />
        <Route path="apis" element={<AdminApis />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="leads/home" element={<AdminHomeEnquiries />} />
        <Route path="leads/college" element={<AdminCollegeEnquiries />} />
        <Route path="leads/contact" element={<AdminContactEnquiries />} />
        <Route path="leads/predictor" element={<AdminPredictorEnquiries />} />
      </Route>

      {/* ── 404 ───────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

export default App;

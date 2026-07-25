import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const Home = lazy(() => import("./pages/Home"));
const CollegeList = lazy(() => import("./pages/CollegeList"));
const CollegeDetail = lazy(() => import("./pages/CollegeDetail"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Courses = lazy(() => import("./pages/Courses"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Contact = lazy(() => import("./pages/Contact"));
const DiscoverColleges = lazy(() => import("./pages/DiscoverColleges"));
const PredictorPage = lazy(() => import("./pages/PredictorPage"));
const CompareColleges = lazy(() => import("./pages/CompareColleges"));
const RoiCalculatorPage = lazy(() => import("./pages/RoiCalculatorPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const ExamsPage = lazy(() => import("./pages/ExamsPage"));
const StudyMaterialPage = lazy(() => import("./pages/StudyMaterialPage"));
const ScholarshipsPage = lazy(() => import("./pages/ScholarshipsPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminColleges = lazy(() => import("./pages/AdminColleges"));
const AdminCollegeForm = lazy(() => import("./pages/AdminCollegeForm"));
const AdminCourses = lazy(() => import("./pages/AdminCourses"));
const AdminCourseForm = lazy(() => import("./pages/AdminCourseForm"));
const AdminExams = lazy(() => import("./pages/AdminExams"));
const AdminExamForm = lazy(() => import("./pages/AdminExamForm"));
const AdminBlogs = lazy(() => import("./pages/AdminBlogs"));
const AdminBlogForm = lazy(() => import("./pages/AdminBlogForm"));
const AdminTestimonials = lazy(() => import("./pages/AdminTestimonials"));
const AdminReviews = lazy(() => import("./pages/AdminReviews"));
const AdminQuestions = lazy(() => import("./pages/AdminQuestions"));
const AdminAlerts = lazy(() => import("./pages/AdminAlerts"));
const AdminScholarships = lazy(() => import("./pages/AdminScholarships"));
const AdminStudyMaterials = lazy(() => import("./pages/AdminStudyMaterials"));
const AdminStreams = lazy(() => import("./pages/AdminStreams"));
const AdminSubstreams = lazy(() => import("./pages/AdminSubstreams"));
const AdminCourseDurations = lazy(() => import("./pages/AdminCourseDurations"));
const AdminApis = lazy(() => import("./pages/AdminApis"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const AdminHomeEnquiries = lazy(() => import("./pages/AdminHomeEnquiries"));
const AdminCollegeEnquiries = lazy(() => import("./pages/AdminCollegeEnquiries"));
const AdminContactEnquiries = lazy(() => import("./pages/AdminContactEnquiries"));
const AdminPredictorEnquiries = lazy(() => import("./pages/AdminPredictorEnquiries"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminBanners = lazy(() => import("./pages/AdminBanners"));

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

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f6f4ef] text-slate-600 font-semibold">
    Loading page...
  </div>
);

const App = () => (
  <>
    <ScrollToTop />
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </ErrorBoundary>
  </>
);

export default App;

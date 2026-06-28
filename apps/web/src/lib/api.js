import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const isLogin = error.config?.url?.includes("/api/auth/login");
    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem("admin_token");
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

const get  = (url, params) => api.get(url, { params }).then((r) => r.data);
const post = (url, data)   => api.post(url, data).then((r) => r.data);
const put  = (url, data)   => api.put(url, data).then((r) => r.data);
const del  = (url)         => api.delete(url).then((r) => r.data);

// Auth & Analytics
export const loginAdmin    = (p)       => post("/api/auth/login", p);
export const getDashboard  = ()        => get("/api/analytics/dashboard");

// Colleges
export const getColleges      = (p)    => get("/api/colleges", p);
export const getCollegeBySlug = (slug) => get(`/api/colleges/slug/${slug}`);
export const getCollegeById   = (id)   => get(`/api/colleges/${id}`);
export const createCollege    = (p)    => post("/api/colleges", p);
export const updateCollege    = (id,p) => put(`/api/colleges/${id}`, p);
export const deleteCollege    = (id)   => del(`/api/colleges/${id}`);

// Courses
export const getCourses    = (p)    => get("/api/courses", p);
export const createCourse  = (p)    => post("/api/courses", p);
export const updateCourse  = (id,p) => put(`/api/courses/${id}`, p);
export const deleteCourse  = (id)   => del(`/api/courses/${id}`);

// Masters (Streams, Substreams, Durations)
export const getStreams       = (p)    => get("/api/masters/streams", p);
export const createStream     = (p)    => post("/api/masters/streams", p);
export const updateStream     = (id,p) => put(`/api/masters/streams/${id}`, p);
export const deleteStream     = (id)   => del(`/api/masters/streams/${id}`);

export const getSubstreams    = (p)    => get("/api/masters/substreams", p);
export const createSubstream  = (p)    => post("/api/masters/substreams", p);
export const updateSubstream  = (id,p) => put(`/api/masters/substreams/${id}`, p);
export const deleteSubstream  = (id)   => del(`/api/masters/substreams/${id}`);

export const getDurations     = (p)    => get("/api/masters/durations", p);
export const createDuration   = (p)    => post("/api/masters/durations", p);
export const updateDuration   = (id,p) => put(`/api/masters/durations/${id}`, p);
export const deleteDuration   = (id)   => del(`/api/masters/durations/${id}`);

// College APIs
export const getApis    = (p)    => get("/api/college-apis", p);
export const createApi  = (p)    => post("/api/college-apis", p);
export const updateApi  = (id,p) => put(`/api/college-apis/${id}`, p);
export const deleteApi  = (id)   => del(`/api/college-apis/${id}`);

// Leads & Smart Recommendation
export const getLeads      = (p)    => get("/api/leads", p);
export const createLead     = (p)    => post("/api/leads", p);
export const updateLead     = (id,p) => put(`/api/leads/${id}`, p);
export const deleteLead     = (id)   => del(`/api/leads/${id}`);
export const sendLeadEmail  = (id)   => post(`/api/leads/${id}/email`, {});

// Blogs
export const getBlogs       = (p)    => get("/api/blogs", p);
export const getBlogBySlug  = (slug) => get(`/api/blogs/slug/${slug}`);
export const getBlogById    = (id)   => get(`/api/blogs/${id}`);
export const createBlog     = (p)    => post("/api/blogs", p);
export const updateBlog     = (id,p) => put(`/api/blogs/${id}`, p);
export const deleteBlog     = (id)   => del(`/api/blogs/${id}`);

// Testimonials
export const getTestimonials     = (p)    => get("/api/testimonials", p);
export const createTestimonial   = (p)    => post("/api/testimonials", p);
export const updateTestimonial   = (id,p) => put(`/api/testimonials/${id}`, p);
export const deleteTestimonial   = (id)   => del(`/api/testimonials/${id}`);

// Exams
export const getExams    = (p)    => get("/api/exams", p);
export const getExamById = (id)   => get(`/api/exams/${id}`);
export const createExam  = (p)    => post("/api/exams", p);
export const updateExam  = (id,p) => put(`/api/exams/${id}`, p);
export const deleteExam  = (id)   => del(`/api/exams/${id}`);

// Scholarships
export const getScholarships    = (p)    => get("/api/scholarships", p);
export const getScholarshipById = (id)   => get(`/api/scholarships/${id}`);
export const createScholarship  = (p)    => post("/api/scholarships", p);
export const updateScholarship  = (id,p) => put(`/api/scholarships/${id}`, p);
export const deleteScholarship  = (id)   => del(`/api/scholarships/${id}`);

// Study Materials
export const getStudyMaterials    = (p)    => get("/api/study-materials", p);
export const getStudyMaterialById = (id)   => get(`/api/study-materials/${id}`);
export const createStudyMaterial  = (p)    => post("/api/study-materials", p);
export const updateStudyMaterial  = (id,p) => put(`/api/study-materials/${id}`, p);
export const deleteStudyMaterial  = (id)   => del(`/api/study-materials/${id}`);

// Reviews
export const getReviews    = (p)    => get("/api/reviews", p);
export const createReview  = (p)    => post("/api/reviews", p);
export const updateReview  = (id,p) => put(`/api/reviews/${id}`, p);
export const deleteReview  = (id)   => del(`/api/reviews/${id}`);

// Questions (Q&A)
export const getQuestions     = (p)    => get("/api/questions", p);
export const getQuestionById  = (id)   => get(`/api/questions/${id}`);
export const createQuestion   = (p)    => post("/api/questions", p);
export const addAnswer        = (id,p) => post(`/api/questions/${id}/answers`, p);
export const upvoteQuestion   = (id)   => post(`/api/questions/${id}/upvote`, {});
export const deleteQuestion   = (id)   => del(`/api/questions/${id}`);

// Alerts
export const getAlerts         = (p) => get("/api/alerts", p);
export const createAlert       = (p) => post("/api/alerts", p);
export const updateAlert       = (id,p) => put(`/api/alerts/${id}`, p);
export const deleteAlert       = (id)   => del(`/api/alerts/${id}`);
export const subscribeAlerts   = (p)    => post("/api/alerts/subscribe", p);
export const getSubscribers    = (p)    => get("/api/alerts/subscribers/all", p);

const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");

// Existing routes
const authRoutes       = require("./routes/authRoutes");
const collegeRoutes    = require("./routes/collegeRoutes");
const courseRoutes     = require("./routes/courseRoutes");
const collegeApiRoutes = require("./routes/collegeApiRoutes");
const leadRoutes       = require("./routes/leadRoutes");
const analyticsRoutes  = require("./routes/analyticsRoutes");
const uploadRoutes     = require("./routes/uploadRoutes");

// New module routes
const blogRoutes          = require("./routes/blogRoutes");
const testimonialRoutes   = require("./routes/testimonialRoutes");
const examRoutes          = require("./routes/examRoutes");
const scholarshipRoutes   = require("./routes/scholarshipRoutes");
const studyMaterialRoutes = require("./routes/studyMaterialRoutes");
const reviewRoutes        = require("./routes/reviewRoutes");
const questionRoutes      = require("./routes/questionRoutes");
const alertRoutes         = require("./routes/alertRoutes");
const predictorRoutes     = require("./routes/predictorRoutes");
const mastersRoutes       = require("./routes/mastersRoutes");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// Existing
app.use("/api/auth",         authRoutes);
app.use("/api/colleges",     collegeRoutes);
app.use("/api/courses",      courseRoutes);
app.use("/api/college-apis", collegeApiRoutes);
app.use("/api/leads",        leadRoutes);
app.use("/api/analytics",    analyticsRoutes);
app.use("/api/uploads",      uploadRoutes);

// New modules
app.use("/api/blogs",           blogRoutes);
app.use("/api/testimonials",    testimonialRoutes);
app.use("/api/exams",           examRoutes);
app.use("/api/scholarships",    scholarshipRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use("/api/reviews",         reviewRoutes);
app.use("/api/questions",       questionRoutes);
app.use("/api/alerts",          alertRoutes);
app.use("/api/predictor",       predictorRoutes);
app.use("/api/masters",         mastersRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

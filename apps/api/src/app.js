const path = require("path");
const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");
const compression = require("compression");
const mongoose = require("mongoose");

const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");
const { publicCache, noCache } = require("./middleware/cache");

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
const bannerRoutes        = require("./routes/bannerRoutes");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Security & Performance middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "..", "..", "..", "uploads")));

// Apply general rate limiting to all API routes
app.use("/api", apiLimiter);

// Apply caching headers to public read-heavy routes
app.use("/api/colleges", publicCache(300));  // Cache colleges for 5 min
app.use("/api/courses", publicCache(300));
app.use("/api/exams", publicCache(300));
app.use("/api/blogs", publicCache(300));
app.use("/api/scholarships", publicCache(300));
app.use("/api/study-materials", publicCache(300));
app.use("/api/reviews", publicCache(300));
app.use("/api/testimonials", publicCache(300));
app.use("/api/questions", publicCache(300));
app.use("/api/alerts", publicCache(300));
app.use("/api/banners", publicCache(300));
app.use("/api/alerts/subscribe", noCache);
app.use("/api/leads", noCache);
app.use("/api/auth", noCache);
app.use("/api/predictor", noCache);
app.use("/api/analytics", noCache);
app.use("/api/uploads", noCache);

app.get("/api/health", (req, res) =>
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  })
);

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
app.use("/api/banners",         bannerRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

const College       = require("../models/College");
const Course        = require("../models/Course");
const Lead          = require("../models/Lead");
const CollegeApi    = require("../models/CollegeApi");
const Blog          = require("../models/Blog");
const Testimonial   = require("../models/Testimonial");
const Exam          = require("../models/Exam");
const Scholarship   = require("../models/Scholarship");
const StudyMaterial = require("../models/StudyMaterial");
const Review        = require("../models/Review");
const Question      = require("../models/Question");
const { Alert, AlertSubscriber } = require("../models/Alert");
const { Parser }    = require("json2csv");
const logger        = require("../utils/logger");

/**
 * Get comprehensive dashboard statistics
 * GET /api/analytics/dashboard
 */
const getDashboardStats = async (req, res, next) => {
  try {
    // Date range filter (default: last 12 months)
    const now = new Date();
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(now.getFullYear() - 1, now.getMonth(), 1);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : now;

    const dateFilter = { createdAt: { $gte: startDate, $lte: endDate } };

    const [
      totalColleges, totalCourses, totalLeads, totalApis,
      activeColleges, inactiveColleges,
      totalBlogs, totalTestimonials, totalExams, totalScholarships,
      totalStudyMaterials, totalReviews, pendingReviews,
      totalQuestions, totalAlerts, totalSubscribers,
      homeLeads, contactLeads, collegeLeads, predictorLeads,
    ] = await Promise.all([
      College.countDocuments({ isDeleted: false }),
      Course.countDocuments({ isDeleted: false }),
      Lead.countDocuments(),
      CollegeApi.countDocuments({ isDeleted: false }),
      College.countDocuments({ status: "Active", isDeleted: false }),
      College.countDocuments({ status: "Inactive", isDeleted: false }),
      Blog.countDocuments({ isDeleted: false }),
      Testimonial.countDocuments({ isDeleted: false }),
      Exam.countDocuments({ isDeleted: false }),
      Scholarship.countDocuments({ isDeleted: false }),
      StudyMaterial.countDocuments({ isDeleted: false }),
      Review.countDocuments({ isDeleted: false }),
      Review.countDocuments({ status: "Pending", isDeleted: false }),
      Question.countDocuments({ isDeleted: false }),
      Alert.countDocuments({ isDeleted: false }),
      AlertSubscriber.countDocuments({ isActive: true }),
      Lead.countDocuments({ ...dateFilter, source: "home_page" }),
      Lead.countDocuments({ ...dateFilter, source: "contact_page" }),
      Lead.countDocuments({ ...dateFilter, source: "college_detail" }),
      Lead.countDocuments({ ...dateFilter, source: "college_predictor" }),
    ]);

    // Monthly lead trends (last 12 months)
    const monthlyLeads = await Lead.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // Lead status breakdown
    const leadStatusBreakdown = await Lead.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Lead source breakdown
    const leadSourceBreakdown = await Lead.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // College type distribution
    const collegeTypeDistribution = await College.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$collegeType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent leads
    const recentLeads = await Lead.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignedColleges", "collegeName")
      .lean();

    // Top colleges by rating
    const topColleges = await College.find({ isDeleted: false, status: "Active" })
      .sort({ rating: -1 })
      .limit(5)
      .select("collegeName shortName rating city state ranking fees")
      .lean();

    // Blog and content publishing trends
    const blogTrends = await Blog.aggregate([
      { $match: { isDeleted: false, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // Enquiry conversion metrics
    const contactedLeads = await Lead.countDocuments({
      ...dateFilter,
      status: { $in: ["Contacted", "Interested"] },
    });
    const admissionDoneLeads = await Lead.countDocuments({
      ...dateFilter,
      status: "Admission Done",
    });

    res.json({
      totals: {
        totalColleges, totalCourses, totalLeads, totalApis,
        activeColleges, inactiveColleges,
        totalBlogs, totalTestimonials, totalExams, totalScholarships,
        totalStudyMaterials, totalReviews, pendingReviews,
        totalQuestions, totalAlerts, totalSubscribers,
        homeLeads, contactLeads, collegeLeads, predictorLeads,
        contactedLeads, admissionDoneLeads,
      },
      trends: {
        monthlyLeads,
        blogTrends,
      },
      breakdowns: {
        leadStatus: leadStatusBreakdown,
        leadSource: leadSourceBreakdown,
        collegeType: collegeTypeDistribution,
      },
      recentLeads,
      topColleges,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Export analytics data as CSV
 * GET /api/analytics/export/csv?type=leads|colleges|blogs
 */
const exportAnalyticsCSV = async (req, res, next) => {
  try {
    const exportType = req.query.type || "leads";

    let data, fields;

    switch (exportType) {
      case "colleges":
        data = await College.find({ isDeleted: false })
          .select("collegeName shortName city state collegeType fees rating ranking status createdAt")
          .lean();
        fields = ["collegeName", "shortName", "city", "state", "collegeType", "fees", "rating", "ranking", "status", "createdAt"];
        break;

      case "blogs":
        data = await Blog.find({ isDeleted: false })
          .select("title category author status publishDate createdAt")
          .lean();
        fields = ["title", "category", "author", "status", "publishDate", "createdAt"];
        break;

      case "leads":
      default:
        data = await Lead.find({})
          .select("name email phone state city course source status createdAt")
          .lean();
        fields = ["name", "email", "phone", "state", "city", "course", "source", "status", "createdAt"];
        break;
    }

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${exportType}_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats, exportAnalyticsCSV };

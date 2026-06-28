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

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalColleges,
      totalCourses,
      totalLeads,
      totalApis,
      activeColleges,
      inactiveColleges,
      totalBlogs,
      totalTestimonials,
      totalExams,
      totalScholarships,
      totalStudyMaterials,
      totalReviews,
      pendingReviews,
      totalQuestions,
      totalAlerts,
      totalSubscribers,
      homeLeads,
      contactLeads,
      collegeLeads,
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
      Lead.countDocuments({ source: "home_page" }),
      Lead.countDocuments({ source: "contact_page" }),
      Lead.countDocuments({ source: "college_detail" }),
    ]);

    const monthlyLeads = await Lead.aggregate([
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    const recentLeads = await Lead.find({}).sort({ createdAt: -1 }).limit(5).lean();

    res.json({
      totals: {
        totalColleges, totalCourses, totalLeads, totalApis,
        activeColleges, inactiveColleges,
        totalBlogs, totalTestimonials, totalExams, totalScholarships,
        totalStudyMaterials, totalReviews, pendingReviews,
        totalQuestions, totalAlerts, totalSubscribers,
        homeLeads, contactLeads, collegeLeads,
      },
      monthlyLeads,
      recentLeads,
    });
  } catch (err) { next(err); }
};

module.exports = { getDashboardStats };

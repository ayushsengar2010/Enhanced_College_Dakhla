const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const path     = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const College       = require("./models/College");
const Course        = require("./models/Course");
const Exam          = require("./models/Exam");
const StudyMaterial = require("./models/StudyMaterial");
const Scholarship   = require("./models/Scholarship");
const Question      = require("./models/Question");
const Review        = require("./models/Review");
const Blog          = require("./models/Blog");
const { Alert }     = require("./models/Alert");
const Testimonial   = require("./models/Testimonial");
const Stream        = require("./models/Stream");
const Substream     = require("./models/Substream");
const CourseDuration= require("./models/CourseDuration");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/college_dakhla";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB for rich full admin module seeding:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // Clear existing collections
    await College.deleteMany({});
    await Course.deleteMany({});
    await Exam.deleteMany({});
    await StudyMaterial.deleteMany({});
    await Scholarship.deleteMany({});
    await Question.deleteMany({});
    await Review.deleteMany({});
    await Blog.deleteMany({});
    await Alert.deleteMany({});
    await Testimonial.deleteMany({});
    await Stream.deleteMany({});
    await Substream.deleteMany({});
    await CourseDuration.deleteMany({});

    console.log("Cleared old collections. Populating comprehensive dataset...");

    // 1. Seed Streams (10 items)
    await Stream.insertMany([
      { streamName: "Engineering", status: "Active" },
      { streamName: "Management", status: "Active" },
      { streamName: "Medical", status: "Active" },
      { streamName: "Commerce", status: "Active" },
      { streamName: "Science", status: "Active" },
      { streamName: "Arts", status: "Active" },
      { streamName: "Design", status: "Active" },
      { streamName: "Pharmacy", status: "Active" },
      { streamName: "MBA", status: "Active" },
      { streamName: "PGDM", status: "Active" },
    ]);

    // 2. Seed Substreams (20 items)
    await Substream.insertMany([
      { streamName: "Engineering", substreamName: "Computer Science & Engineering", status: "Active" },
      { streamName: "Engineering", substreamName: "Artificial Intelligence & Data Science", status: "Active" },
      { streamName: "Engineering", substreamName: "Electronics & Communication Engineering", status: "Active" },
      { streamName: "Engineering", substreamName: "Mechanical Engineering", status: "Active" },
      { streamName: "Engineering", substreamName: "Civil Engineering", status: "Active" },
      { streamName: "Engineering", substreamName: "Robotics and Automation", status: "Active" },
      { streamName: "Management", substreamName: "Finance & Banking", status: "Active" },
      { streamName: "Management", substreamName: "Marketing & Brand Strategy", status: "Active" },
      { streamName: "Management", substreamName: "Human Resource Management", status: "Active" },
      { streamName: "Management", substreamName: "International Business", status: "Active" },
      { streamName: "Medical", substreamName: "General Medicine & Surgery (MBBS)", status: "Active" },
      { streamName: "Medical", substreamName: "Pulmonology & Respiratory Care", status: "Active" },
      { streamName: "Medical", substreamName: "Operation Theatre Technology", status: "Active" },
      { streamName: "Medical", substreamName: "X-Ray Technology & Imaging", status: "Active" },
      { streamName: "Design", substreamName: "Animation and VFX", status: "Active" },
      { streamName: "Design", substreamName: "Fashion & Textile Design", status: "Active" },
      { streamName: "Arts", substreamName: "Physical Geography & Environmental Studies", status: "Active" },
      { streamName: "Arts", substreamName: "Broadcast Journalism & Mass Communication", status: "Active" },
      { streamName: "Arts", substreamName: "Office Management and Secretarial Practice", status: "Active" },
      { streamName: "Arts", substreamName: "Police Administration and Criminology", status: "Active" },
    ]);

    // 3. Seed Course Durations (4 items)
    await CourseDuration.insertMany([
      { duration: "4 Years", status: "Active" },
      { duration: "3 Years", status: "Active" },
      { duration: "2 Years", status: "Active" },
      { duration: "1 Year", status: "Active" },
    ]);

    // 4. Seed Courses (20 items)
    const insertedCourses = await Course.insertMany([
      { courseName: "B.Tech Computer Science and Engineering", stream: "Engineering", subStream: "Computer Science & Engineering", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM with 75% aggregate", entranceExam: "JEE Main / Advanced", feeAmount: "220000/Yr", courseReview: "4.9/5", status: "Active" },
      { courseName: "B.Tech Artificial Intelligence and Machine Learning", stream: "Engineering", subStream: "Artificial Intelligence & Data Science", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM with 75% aggregate", entranceExam: "JEE Main / Advanced", feeAmount: "240000/Yr", courseReview: "4.8/5", status: "Active" },
      { courseName: "B.Tech Electronics and Communication", stream: "Engineering", subStream: "Electronics & Communication Engineering", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM with 60%", entranceExam: "JEE Main / MET", feeAmount: "210000/Yr", courseReview: "4.6/5", status: "Active" },
      { courseName: "B.Tech Mechanical Engineering", stream: "Engineering", subStream: "Mechanical Engineering", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM", entranceExam: "JEE Main", feeAmount: "200000/Yr", courseReview: "4.5/5", status: "Active" },
      { courseName: "B.Tech Robotics and Automation", stream: "Engineering", subStream: "Robotics and Automation", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM with 65%", entranceExam: "JEE Main / BITSAT", feeAmount: "250000/Yr", courseReview: "4.7/5", status: "Active" },
      { courseName: "M.Tech Software Engineering", stream: "Engineering", subStream: "Computer Science & Engineering", courseType: "Masters", duration: "2 Years", eligibility: "B.Tech / BE in relevant branch", entranceExam: "GATE", feeAmount: "150000/Yr", courseReview: "4.8/5", status: "Active" },
      { courseName: "MBA Finance and Investment Banking", stream: "Management", subStream: "Finance & Banking", courseType: "Masters", duration: "2 Years", eligibility: "Bachelor's Degree with 50%", entranceExam: "CAT / XAT / GMAT", feeAmount: "450000/Yr", courseReview: "4.9/5", status: "Active" },
      { courseName: "MBA Marketing and Brand Strategy", stream: "Management", subStream: "Marketing & Brand Strategy", courseType: "Masters", duration: "2 Years", eligibility: "Bachelor's Degree in any field", entranceExam: "CAT / MAT / CMAT", feeAmount: "420000/Yr", courseReview: "4.7/5", status: "Active" },
      { courseName: "MBA Human Resource Management", stream: "Management", subStream: "Human Resource Management", courseType: "Masters", duration: "2 Years", eligibility: "Graduation with 50%", entranceExam: "CAT / NMAT", feeAmount: "400000/Yr", courseReview: "4.6/5", status: "Active" },
      { courseName: "BBA International Business", stream: "Management", subStream: "International Business", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Any Recognized Board", entranceExam: "CUET UG / IPMAT", feeAmount: "135000/Yr", courseReview: "4.5/5", status: "Active" },
      { courseName: "B.Com Honours Accounting & Finance", stream: "Commerce", subStream: "Finance & Banking", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Commerce with Math", entranceExam: "CUET UG", feeAmount: "85000/Yr", courseReview: "4.6/5", status: "Active" },
      { courseName: "BA Economics Honours", stream: "Arts", subStream: "Physical Geography & Environmental Studies", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Any Stream", entranceExam: "CUET UG", feeAmount: "65000/Yr", courseReview: "4.7/5", status: "Active" },
      { courseName: "BA Journalism and Mass Communication", stream: "Arts", subStream: "Broadcast Journalism & Mass Communication", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Any Stream", entranceExam: "CUET UG / University Test", feeAmount: "95000/Yr", courseReview: "4.6/5", status: "Active" },
      { courseName: "MBBS Bachelor of Medicine and Surgery", stream: "Medical", subStream: "General Medicine & Surgery (MBBS)", courseType: "Bachelors", duration: "5.5 Years", eligibility: "10+2 PCB with 50% aggregate", entranceExam: "NEET UG", feeAmount: "135000/Yr", courseReview: "5.0/5", status: "Active" },
      { courseName: "B.Sc Operation Theatre Technology", stream: "Medical", subStream: "Operation Theatre Technology", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 PCB", entranceExam: "NEET / University Entrance", feeAmount: "90000/Yr", courseReview: "4.4/5", status: "Active" },
      { courseName: "B.Pharm Bachelor of Pharmacy", stream: "Pharmacy", subStream: "General Medicine & Surgery (MBBS)", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCB / PCM", entranceExam: "NEET / State CET", feeAmount: "110000/Yr", courseReview: "4.5/5", status: "Active" },
      { courseName: "B.Des Animation and VFX", stream: "Design", subStream: "Animation and VFX", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 Any Stream", entranceExam: "NID DAT / UCEED / NIFT", feeAmount: "300000/Yr", courseReview: "4.8/5", status: "Active" },
      { courseName: "B.Des Fashion and Textile Design", stream: "Design", subStream: "Fashion & Textile Design", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 Any Stream", entranceExam: "NIFT Entrance Exam", feeAmount: "280000/Yr", courseReview: "4.7/5", status: "Active" },
      { courseName: "PGDM Post Graduate Diploma in Management", stream: "PGDM", subStream: "Marketing & Brand Strategy", courseType: "Diploma", duration: "2 Years", eligibility: "Bachelor's Degree with 50%", entranceExam: "CAT / MAT / XAT", feeAmount: "500000/Yr", courseReview: "4.8/5", status: "Active" },
      { courseName: "Diploma in Mechanical Engineering", stream: "Engineering", subStream: "Mechanical Engineering", courseType: "Diploma", duration: "3 Years", eligibility: "Class 10th Pass", entranceExam: "Polytechnic CET", feeAmount: "450000/Total", courseReview: "4.3/5", status: "Active" },
    ]);

    const cIds = insertedCourses.map(c => c._id);

    // 5. Seed Genuine Colleges with rich UP & State representation (3+ colleges for every major city)
    const insertedColleges = await College.insertMany([
      // --- MATHURA (3 Colleges) ---
      { collegeName: "GLA University, Mathura", shortName: "GLA", slug: "gla-university-mathura", location: "Mathura, Uttar Pradesh", city: "Mathura", state: "Uttar Pradesh", category: "Private", ranking: 15, fees: 185000, highestPackage: "₹55 LPA", rating: 4.6, bestFor: "NAAC A+ Grade, Top Ranked University in Mathura UP", cutoffExam: "CUET / GLAET / JEE Main", cutoffScore: "Score ~ 75%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "BSA College of Engineering & Technology, Mathura", shortName: "BSACET", slug: "bsa-college-mathura", location: "Mathura, Uttar Pradesh", city: "Mathura", state: "Uttar Pradesh", category: "Private", ranking: 45, fees: 95000, highestPackage: "₹18 LPA", rating: 4.2, bestFor: "Premier AKTU Affiliated Institute in Mathura", cutoffExam: "JEE Main / UPTAC", cutoffScore: "Rank ~ 65000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.2/5", status: "Active", courses: cIds },
      { collegeName: "Sanskriti University, Mathura", shortName: "SU", slug: "sanskriti-university-mathura", location: "Mathura, Uttar Pradesh", city: "Mathura", state: "Uttar Pradesh", category: "Private", ranking: 38, fees: 130000, highestPackage: "₹28 LPA", rating: 4.3, bestFor: "30+ Acre Ultra Modern Campus in Mathura", cutoffExam: "SEEE / CUET / JEE Main", cutoffScore: "Score ~ 70%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.3/5", status: "Active", courses: cIds },

      // --- NOIDA (3 Colleges) ---
      { collegeName: "Shiv Nadar University, Noida", shortName: "SNU", slug: "shiv-nadar-university", location: "Noida, Uttar Pradesh", city: "Noida", state: "Uttar Pradesh", category: "Private", ranking: 2, fees: 650000, highestPackage: "₹58 LPA", rating: 4.8, bestFor: "Multidisciplinary Research & Innovation Leader", cutoffExam: "JEE Main / SNUSAT", cutoffScore: "JEE Main Rank ~ 25,000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.8/5", status: "Active", courses: cIds },
      { collegeName: "Amity University, Noida", shortName: "AMITY", slug: "amity-noida", location: "Noida, Uttar Pradesh", city: "Noida", state: "Uttar Pradesh", category: "Private", ranking: 18, fees: 310000, highestPackage: "₹61.75 LPA", rating: 4.3, bestFor: "Global Campuses and Industry Tie-ups", cutoffExam: "Direct / Amity JEE", cutoffScore: "Score ~ 80%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.3/5", status: "Active", courses: cIds },
      { collegeName: "JSS Academy of Technical Education, Noida", shortName: "JSSATE", slug: "jss-noida", location: "Noida, Uttar Pradesh", city: "Noida", state: "Uttar Pradesh", category: "Private", ranking: 25, fees: 140000, highestPackage: "₹40 LPA", rating: 4.4, bestFor: "Top Ranked AKTU College in Noida NCR", cutoffExam: "JEE Main / UPTAC", cutoffScore: "JEE Main Rank ~ 35,000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.4/5", status: "Active", courses: cIds },

      // --- GREATER NOIDA (3 Colleges) ---
      { collegeName: "Galgotias University, Greater Noida", shortName: "GU", slug: "galgotias-university", location: "Greater Noida, Uttar Pradesh", city: "Greater Noida", state: "Uttar Pradesh", category: "Private", ranking: 12, fees: 160000, highestPackage: "₹1.5 CPA", rating: 4.5, bestFor: "100% Placement Assistance & Industry Partners", cutoffExam: "GEEE / CUET / JEE Main", cutoffScore: "Score ~ 75%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.5/5", status: "Active", courses: cIds },
      { collegeName: "Sharda University, Greater Noida", shortName: "SU", slug: "sharda-university", location: "Greater Noida, Uttar Pradesh", city: "Greater Noida", state: "Uttar Pradesh", category: "Private", ranking: 20, fees: 220000, highestPackage: "₹48 LPA", rating: 4.3, bestFor: "International Students Hub & Global Exposure", cutoffExam: "SUAT / JEE Main", cutoffScore: "Score ~ 70%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.3/5", status: "Active", courses: cIds },
      { collegeName: "Bennett University, Greater Noida", shortName: "BU", slug: "bennett-university", location: "Greater Noida, Uttar Pradesh", city: "Greater Noida", state: "Uttar Pradesh", category: "Private", ranking: 14, fees: 360000, highestPackage: "₹57 LPA", rating: 4.6, bestFor: "Times Group Backed Ivy-League Style Education", cutoffExam: "JEE Main / SAT", cutoffScore: "Percentile ~ 80%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.6/5", status: "Active", courses: cIds },

      // --- KANPUR (3 Colleges) ---
      { collegeName: "IIT Kanpur - Indian Institute of Technology [IITK]", shortName: "IITK", slug: "iit-kanpur", location: "Kanpur, Uttar Pradesh", city: "Kanpur", state: "Uttar Pradesh", category: "Government", ranking: 4, fees: 215000, highestPackage: "₹1.9 CPA", rating: 4.9, bestFor: "Ranked 4 out of 500 Collegedunia, Premier Institute", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 215", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "HBTU Kanpur - Harcourt Butler Technical University", shortName: "HBTU", slug: "hbtu-kanpur", location: "Kanpur, Uttar Pradesh", city: "Kanpur", state: "Uttar Pradesh", category: "Government", ranking: 22, fees: 135000, highestPackage: "₹44 LPA", rating: 4.5, bestFor: "Historical Premier Technical Institution in UP", cutoffExam: "JEE Main / UPTAC", cutoffScore: "JEE Main Rank ~ 25,000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.5/5", status: "Active", courses: cIds },
      { collegeName: "PSIT Kanpur - Pranveer Singh Institute of Technology", shortName: "PSIT", slug: "psit-kanpur", location: "Kanpur, Uttar Pradesh", city: "Kanpur", state: "Uttar Pradesh", category: "Private", ranking: 30, fees: 125000, highestPackage: "₹40 LPA", rating: 4.4, bestFor: "Top Corporate Placements in Central UP", cutoffExam: "JEE Main / UPTAC", cutoffScore: "Rank ~ 50000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.4/5", status: "Active", courses: cIds },

      // --- LUCKNOW (3 Colleges) ---
      { collegeName: "IIM Lucknow - Indian Institute of Management", shortName: "IIML", slug: "iim-lucknow", location: "Lucknow, Uttar Pradesh", city: "Lucknow", state: "Uttar Pradesh", category: "Government", ranking: 5, fees: 1075000, highestPackage: "₹1.0 CPA", rating: 4.9, bestFor: "Top Premier Business School in North India", cutoffExam: "CAT", cutoffScore: "Percentile ~ 99", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "IET Lucknow - Institute of Engineering and Technology", shortName: "IET", slug: "iet-lucknow", location: "Lucknow, Uttar Pradesh", city: "Lucknow", state: "Uttar Pradesh", category: "Government", ranking: 24, fees: 85000, highestPackage: "₹49 LPA", rating: 4.6, bestFor: "Top Autonomous Engineering College under AKTU", cutoffExam: "JEE Main / UPTAC", cutoffScore: "Rank ~ 20000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "BBU Lucknow - Babasaheb Bhimrao Ambedkar University", shortName: "BBAU", slug: "bbau-lucknow", location: "Lucknow, Uttar Pradesh", city: "Lucknow", state: "Uttar Pradesh", category: "Government", ranking: 35, fees: 55000, highestPackage: "₹22 LPA", rating: 4.3, bestFor: "NAAC A++ Central University in Lucknow", cutoffExam: "CUET UG / CUET PG", cutoffScore: "Score ~ 85%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.3/5", status: "Active", courses: cIds },

      // --- VARANASI (3 Colleges) ---
      { collegeName: "IIT BHU Varanasi - Indian Institute of Technology", shortName: "IIT BHU", slug: "iit-bhu-varanasi", location: "Varanasi, Uttar Pradesh", city: "Varanasi", state: "Uttar Pradesh", category: "Government", ranking: 9, fees: 220000, highestPackage: "₹1.2 CPA", rating: 4.8, bestFor: "Heritage Technical Institute inside BHU Campus", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 1000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.8/5", status: "Active", courses: cIds },
      { collegeName: "Banaras Hindu University [BHU], Varanasi", shortName: "BHU", slug: "bhu-varanasi", location: "Varanasi, Uttar Pradesh", city: "Varanasi", state: "Uttar Pradesh", category: "Government", ranking: 6, fees: 12000, highestPackage: "₹38 LPA", rating: 4.8, bestFor: "World-Renowned Central University", cutoffExam: "CUET UG / NEET", cutoffScore: "Score ~ 95%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.8/5", status: "Active", courses: cIds },
      { collegeName: "Kashi Institute of Technology, Varanasi", shortName: "KIT", slug: "kit-varanasi", location: "Varanasi, Uttar Pradesh", city: "Varanasi", state: "Uttar Pradesh", category: "Private", ranking: 48, fees: 90000, highestPackage: "₹18 LPA", rating: 4.1, bestFor: "Leading AKTU Technical College in Eastern UP", cutoffExam: "JEE Main / UPTAC", cutoffScore: "Rank ~ 75000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.1/5", status: "Active", courses: cIds },

      // --- AGRA (3 Colleges) ---
      { collegeName: "Dayalbagh Educational Institute [DEI], Agra", shortName: "DEI", slug: "dei-agra", location: "Agra, Uttar Pradesh", city: "Agra", state: "Uttar Pradesh", category: "Government", ranking: 28, fees: 14000, highestPackage: "₹25 LPA", rating: 4.6, bestFor: "NAAC A+ Deemed University with Ultra Low Fees", cutoffExam: "DEI Entrance Test / JEE Main", cutoffScore: "Score ~ 80%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "RBS College - Raja Balwant Singh College, Agra", shortName: "RBS", slug: "rbs-college-agra", location: "Agra, Uttar Pradesh", city: "Agra", state: "Uttar Pradesh", category: "Government", ranking: 42, fees: 25000, highestPackage: "₹15 LPA", rating: 4.2, bestFor: "Historic Premier Asia Educational Center", cutoffExam: "Merit / CUET", cutoffScore: "Score ~ 75%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.2/5", status: "Active", courses: cIds },
      { collegeName: "Anand Engineering College, Agra", shortName: "AEC", slug: "aec-agra", location: "Agra, Uttar Pradesh", city: "Agra", state: "Uttar Pradesh", category: "Private", ranking: 50, fees: 105000, highestPackage: "₹20 LPA", rating: 4.0, bestFor: "Sharda Group Technical Campus in Agra", cutoffExam: "JEE Main / UPTAC", cutoffScore: "Rank ~ 80000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.0/5", status: "Active", courses: cIds },

      // --- DELHI NCR (3 Colleges) ---
      { collegeName: "IIT Delhi - Indian Institute of Technology [IITD]", shortName: "IITD", slug: "iit-delhi", location: "New Delhi, Delhi NCR", city: "New Delhi", state: "Delhi", category: "Government", ranking: 2, fees: 220000, highestPackage: "₹2.0 CPA", rating: 4.9, bestFor: "Ranked 2 out of 500 Collegedunia, Ranked 2 NIRF", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 100", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "DTU Delhi - Delhi Technological University", shortName: "DTU", slug: "dtu-delhi", location: "New Delhi, Delhi NCR", city: "New Delhi", state: "Delhi", category: "Government", ranking: 12, fees: 219000, highestPackage: "₹64.2 LPA", rating: 4.7, bestFor: "Premier State Technical University", cutoffExam: "JEE Main / JAC Delhi", cutoffScore: "Rank ~ 6000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.7/5", status: "Active", courses: cIds },
      { collegeName: "Jamia Millia Islamia [JMI]", shortName: "JMI", slug: "jmi-new-delhi", location: "New Delhi, Delhi NCR", city: "New Delhi", state: "Delhi", category: "Government", ranking: 19, fees: 45000, highestPackage: "₹25 LPA", rating: 4.7, bestFor: "Top Central University with Low Fees", cutoffExam: "JEE Main", cutoffScore: "Rank ~ 25000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.7/5", status: "Active", courses: cIds },

      // --- BANGALORE (3 Colleges) ---
      { collegeName: "IISc Bangalore - Indian Institute of Science", shortName: "IISC", slug: "iisc-bangalore", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", category: "Government", ranking: 1, fees: 35000, highestPackage: "₹86 LPA", rating: 4.9, bestFor: "India's #1 Ranked Science & Research University", cutoffExam: "JEE Advanced / NEET / GATE", cutoffScore: "AIR ~ 250", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "RV College of Engineering [RVCE], Bangalore", shortName: "RVCE", slug: "rvce-bangalore", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", category: "Private", ranking: 11, fees: 240000, highestPackage: "₹92 LPA", rating: 4.8, bestFor: "Silicon Valley Placement Record in Bangalore", cutoffExam: "KCET / COMEDK", cutoffScore: "COMEDK Rank ~ 500", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.8/5", status: "Active", courses: cIds },
      { collegeName: "BMS College of Engineering [BMSCE], Bangalore", shortName: "BMSCE", slug: "bmsce-bangalore", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", category: "Private", ranking: 16, fees: 220000, highestPackage: "₹50 LPA", rating: 4.6, bestFor: "Heritage Autonomous Technical College", cutoffExam: "KCET / COMEDK", cutoffScore: "Rank ~ 1200", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.6/5", status: "Active", courses: cIds },

      // --- MUMBAI (3 Colleges) ---
      { collegeName: "IIT Bombay - Indian Institute of Technology [IITB]", shortName: "IITB", slug: "iit-bombay", location: "Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", category: "Government", ranking: 3, fees: 218000, highestPackage: "₹3.67 CPA", rating: 4.9, bestFor: "Ranked 3 out of 500 Collegedunia, Ranked 3 NIRF", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 60", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "VJTI Mumbai - Veermata Jijabai Technological Institute", shortName: "VJTI", slug: "vjti-mumbai", location: "Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", category: "Government", ranking: 13, fees: 85000, highestPackage: "₹62 LPA", rating: 4.7, bestFor: "Top Autonmous Engineering Institute in Maharashtra", cutoffExam: "MHT CET / JEE Main", cutoffScore: "MHT CET Percentile ~ 99.5", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.7/5", status: "Active", courses: cIds },
      { collegeName: "ICT Mumbai - Institute of Chemical Technology", shortName: "ICT", slug: "ict-mumbai", location: "Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", category: "Government", ranking: 17, fees: 90000, highestPackage: "₹40 LPA", rating: 4.8, bestFor: "Global Leader in Chemical & Polymer Technology", cutoffExam: "MHT CET / JEE Main", cutoffScore: "Percentile ~ 99.0", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.8/5", status: "Active", courses: cIds },

      // --- PUNE (3 Colleges) ---
      { collegeName: "COEP Technological University, Pune", shortName: "COEP", slug: "coep-pune", location: "Pune, Maharashtra", city: "Pune", state: "Maharashtra", category: "Government", ranking: 10, fees: 95000, highestPackage: "₹50 LPA", rating: 4.8, bestFor: "3rd Oldest Engineering College in Asia", cutoffExam: "MHT CET / JEE Main", cutoffScore: "MHT CET Percentile ~ 99.6", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.8/5", status: "Active", courses: cIds },
      { collegeName: "MIT World Peace University [MIT-WPU], Pune", shortName: "MITWPU", slug: "mit-wpu-pune", location: "Pune, Maharashtra", city: "Pune", state: "Maharashtra", category: "Private", ranking: 26, fees: 320000, highestPackage: "₹51 LPA", rating: 4.4, bestFor: "State-of-the-Art Campus & Industry Collaborations", cutoffExam: "JEE Main / MHT CET / PERA CET", cutoffScore: "Score ~ 85%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.4/5", status: "Active", courses: cIds },
      { collegeName: "Vishwakarma Institute of Technology [VIT], Pune", shortName: "VIT PUNE", slug: "vit-pune", location: "Pune, Maharashtra", city: "Pune", state: "Maharashtra", category: "Private", ranking: 29, fees: 180000, highestPackage: "₹44 LPA", rating: 4.5, bestFor: "Autonomous Institute with Outstanding Placements", cutoffExam: "MHT CET / JEE Main", cutoffScore: "Percentile ~ 98.5", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.5/5", status: "Active", courses: cIds },

      // --- HARYANA & RAJASTHAN PRESERVED (6 Colleges) ---
      { collegeName: "St Andrews Institute of Technology & Management (SAITM), Gurugram", shortName: "SAITM", slug: "saitm-gurugram", location: "Gurugram, Haryana", city: "Gurugram", state: "Haryana", category: "Private", ranking: 10, fees: 220000, highestPackage: "₹28 LPA", rating: 3.9, cutoffExam: "JEE Main / HSTES", cutoffScore: "JEE Main Rank ~ 5,15,000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "3.9/5", status: "Active", courses: cIds },
      { collegeName: "NIT Kurukshetra - National Institute of Technology", shortName: "NITKKR", slug: "nit-kurukshetra", location: "Kurukshetra, Haryana", city: "Kurukshetra", state: "Haryana", category: "Government", ranking: 8, fees: 180000, highestPackage: "₹51 LPA", rating: 4.6, bestFor: "Institute of National Importance in Haryana", cutoffExam: "JEE Main / DASA", cutoffScore: "JEE Main Rank ~ 8,500", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "JC Bose University of Science & Technology YMCA", shortName: "YMCA", slug: "ymca-faridabad", location: "Faridabad, Haryana", city: "Faridabad", state: "Haryana", category: "Government", ranking: 14, fees: 110000, highestPackage: "₹35 LPA", rating: 4.4, bestFor: "Premier State Technical University in Haryana", cutoffExam: "JEE Main / HSTES", cutoffScore: "JEE Main Rank ~ 35,000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.4/5", status: "Active", courses: cIds },
      { collegeName: "Ashoka University, Sonepat", shortName: "ASHOKA", slug: "ashoka-university", location: "Sonepat, Haryana", city: "Sonepat", state: "Haryana", category: "Private", ranking: 16, fees: 950000, highestPackage: "₹40 LPA", rating: 4.7, bestFor: "Top Premier Liberal Arts & Sciences University", cutoffExam: "Ashoka Aptitude Test (AAT)", cutoffScore: "Score ~ 85%", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.7/5", status: "Active", courses: cIds },
      { collegeName: "MDU Rohtak - Maharshi Dayanand University", shortName: "MDU", slug: "mdu-rohtak", location: "Rohtak, Haryana", city: "Rohtak", state: "Haryana", category: "Government", ranking: 21, fees: 65000, highestPackage: "₹18 LPA", rating: 4.3, bestFor: "NAAC A+ Accredited State University", cutoffExam: "MDUCEE / JEE Main", cutoffScore: "Rank ~ 45,000", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.3/5", status: "Active", courses: cIds },
      { collegeName: "BITS Pilani - Birla Institute of Technology and Science", shortName: "BITS", slug: "bits-pilani", location: "Pilani, Rajasthan", city: "Pilani", state: "Rajasthan", category: "Private", ranking: 11, fees: 540000, highestPackage: "₹60.7 LPA", rating: 4.8, bestFor: "Top Ranked Private Engineering Institute", cutoffExam: "BITSAT", cutoffScore: "Score ~ 320", applicationStart: new Date("2026-05-20"), applicationEnd: new Date("2026-08-15"), userReviews: "4.8/5", status: "Active", courses: cIds }
    ]);

    // 6. Seed Entrance Exams (6 items)
    await Exam.insertMany([
      { examName: "JEE Main 2026", slug: "jee-main-2026", shortName: "JEE Main", stream: "Engineering", conductingBody: "National Testing Agency (NTA)", examLevel: "National", examMode: "Online Exam", participatingCollegesCount: 1986, description: "Joint Entrance Examination Main for admission to NITs, IIITs, and CFTIs.", eligibility: "10+2 with Physics, Chemistry, and Mathematics", syllabus: "Physics, Chemistry, and Mathematics of Class 11th and 12th CBSE curriculum", examPattern: "75 Multiple Choice and Numerical Questions across PCM", applicationStart: new Date("2025-11-01"), applicationEnd: new Date("2026-01-15"), examDate: new Date("2026-04-02"), resultDate: new Date("2026-04-25"), officialWebsite: "https://jeemain.nta.ac.in", applicationLink: "https://jeemain.nta.ac.in", applicationFee: 1000, status: "Active" },
      { examName: "JEE Advanced 2026", slug: "jee-advanced-2026", shortName: "JEE Adv", stream: "Engineering", conductingBody: "IIT Kanpur", examLevel: "National", examMode: "Online Exam", participatingCollegesCount: 31, description: "Premier entrance exam for admissions into 23 Indian Institutes of Technology (IITs).", eligibility: "Top 2,500,000 rankers in JEE Main 2026", syllabus: "Advanced level concepts in Physics, Chemistry, and Mathematics", examPattern: "Two papers of 3 hours duration each", applicationStart: new Date("2026-04-26"), applicationEnd: new Date("2026-05-07"), examDate: new Date("2026-05-17"), resultDate: new Date("2026-06-09"), officialWebsite: "https://jeeadv.ac.in", applicationLink: "https://jeeadv.ac.in", applicationFee: 3200, status: "Active" },
      { examName: "NEET UG 2026", slug: "neet-ug-2026", shortName: "NEET", stream: "Medical", conductingBody: "National Testing Agency (NTA)", examLevel: "National", examMode: "Offline Pen-Paper", participatingCollegesCount: 650, description: "Single national level entrance test for MBBS, BDS, and AYUSH courses.", eligibility: "10+2 with Physics, Chemistry, Biology with 50% aggregate", syllabus: "Physics, Chemistry, Botany, and Zoology of 11th & 12th standard", examPattern: "200 Multiple Choice Questions (180 to be attempted)", applicationStart: new Date("2026-02-09"), applicationEnd: new Date("2026-03-16"), examDate: new Date("2026-05-03"), resultDate: new Date("2026-06-14"), officialWebsite: "https://neet.nta.nic.in", applicationLink: "https://neet.nta.nic.in", applicationFee: 1700, status: "Active" },
      { examName: "CAT 2026 - Common Admission Test", slug: "cat-2026", shortName: "CAT", stream: "Management", conductingBody: "IIM Ahmedabad", examLevel: "National", examMode: "Computer Based Test", participatingCollegesCount: 1200, description: "Premier entrance examination for admission into IIMs and top B-Schools across India.", eligibility: "Bachelor's Degree with at least 50% marks", syllabus: "VARC, DILR, and Quantitative Aptitude", examPattern: "66 Questions across 3 timed sections (2 Hours)", applicationStart: new Date("2026-08-02"), applicationEnd: new Date("2026-09-20"), examDate: new Date("2026-11-29"), resultDate: new Date("2027-01-05"), officialWebsite: "https://iimcat.ac.in", applicationLink: "https://iimcat.ac.in", applicationFee: 2400, status: "Active" },
      { examName: "CUET UG 2026", slug: "cuet-ug-2026", shortName: "CUET", stream: "Arts", conductingBody: "National Testing Agency (NTA)", examLevel: "National", examMode: "Offline Exam", participatingCollegesCount: 115, description: "Common University Entrance Test for Central and State Universities across India.", eligibility: "Class 12th appeared or passed", syllabus: "Domain specific subjects and general aptitude testing", examPattern: "Computer Based Test / Hybrid mode multiple choice questions", applicationStart: new Date("2026-02-09"), applicationEnd: new Date("2026-04-05"), examDate: new Date("2026-05-11"), resultDate: new Date("2026-06-15"), officialWebsite: "https://cuetug.ntaonline.in", applicationLink: "https://cuetug.ntaonline.in", applicationFee: 750, status: "Active" },
      { examName: "BITSAT 2026", slug: "bitsat-2026", shortName: "BITSAT", stream: "Engineering", conductingBody: "BITS Pilani", examLevel: "National", examMode: "Online Computer Based", participatingCollegesCount: 4, description: "University level entrance exam for B.E., B.Pharm, and M.Sc programs at BITS campuses.", eligibility: "10+2 PCM with 75% aggregate", syllabus: "Physics, Chemistry, Mathematics, English Proficiency & Logical Reasoning", examPattern: "130 Multiple Choice Questions", applicationStart: new Date("2026-01-15"), applicationEnd: new Date("2026-04-10"), examDate: new Date("2026-05-20"), resultDate: new Date("2026-06-10"), officialWebsite: "https://bitsadmission.com", applicationLink: "https://bitsadmission.com", applicationFee: 3400, status: "Active" }
    ]);

    // 7. Seed Blogs (6 educational articles)
    await Blog.insertMany([
      { title: "What is a good score in MHT CET 2026?", blogCategory: "Exam Alerts", author: "Dr. K. Sharma", publishDate: new Date("2026-05-21"), blogDescription: "A Score Of 150 Marks Or Above Out Of 200 Is Considered A Good Score In MHT CET 2026 For General Category Candidates.", content: "Detailed breakdown of MHT CET 2026 percentile vs marks calculation and college allotment cutoffs across top Maharashtra engineering institutes.", status: "Active" },
      { title: "VITEEE 2026 Registration Begins @viteee.vit.ac.in", blogCategory: "Exam Alerts", author: "Admission Cell", publishDate: new Date("2025-10-26"), blogDescription: "The Vellore Institute Of Technology (VIT) Has Officially Released The VITEEE 2026 Application Form online.", content: "Step by step application procedure, slot booking details, exam pattern changes, and fee structure for VIT Vellore, Chennai, AP, and Bhopal campuses.", status: "Active" },
      { title: "Top 10 Private Engineering Colleges in North India with Highest CTC", blogCategory: "College Comparison", author: "Priya Varma", publishDate: new Date("2026-04-10"), blogDescription: "Complete comparison guide evaluating placements, infrastructure, and fee ROI across North India's private universities.", content: "Comprehensive analysis comparing GLA University Mathura, Shiv Nadar University, Ashoka, and Amity Noida based on real 2025-2026 placement statistics.", status: "Active" },
      { title: "How to Crack JEE Main 2026 in 90 Days: Preparation Strategy", blogCategory: "Preparation Guide", author: "Prof. R. C. Das", publishDate: new Date("2026-01-15"), blogDescription: "Master high-weightage chapters in Physics, Chemistry, and Math with our proven 90-day revision strategy.", content: "Structured day-by-day revision schedule, formula sheets, mock test strategy, and time management techniques for JEE aspirants.", status: "Active" },
      { title: "CUET UG 2026 Syllabus and Exam Pattern Breakdown", blogCategory: "Career Guidance", author: "Ankita Roy", publishDate: new Date("2026-03-01"), blogDescription: "Everything you need to know about domain subjects, general test scoring, and normalization procedures.", content: "Detailed guide explaining section-wise subject mapping for Delhi University, BHU, and Central Universities.", status: "Active" }
    ]);

    // 8. Seed Live Alerts (6 items)
    await Alert.insertMany([
      { title: "JEE Main 2026 Session 2 Slot Booking Link Activated", type: "Exam", body: "NTA has activated the candidate portal for shift allocation and admit card download for Session 2 exams.", link: "https://jeemain.nta.ac.in", deadline: new Date("2026-04-01"), status: "Active" },
      { title: "JoSAA Counselling 2026 Choice Locking Starts", type: "Admission", body: "Joint Seat Allocation Authority has opened online choice filling for IITs, NITs, and IIITs seat allotments.", link: "https://josaa.nic.in", deadline: new Date("2026-06-25"), status: "Active" },
      { title: "NEET UG 2026 Application Correction Window Open", type: "Exam", body: "Candidates can update category details, exam city preferences, and uploaded documents till April 15th.", link: "https://neet.nta.nic.in", deadline: new Date("2026-04-15"), status: "Active" },
      { title: "GLA University Mathura B.Tech & MBA Direct Merit Admissions 2026 Open", type: "Admission", body: "Applications invited for NAAC A+ Grade university programs with up to 100% merit scholarship waiver.", link: "https://gla.ac.in", deadline: new Date("2026-07-31"), status: "Active" },
      { title: "CAT 2026 Registration Dates Announced by IIM Ahmedabad", type: "Exam", body: "IIM Ahmedabad will initiate online registrations for Common Admission Test starting August 2nd.", link: "https://iimcat.ac.in", deadline: new Date("2026-09-20"), status: "Active" }
    ]);

    // 9. Seed Campus Reviews (5 items)
    const iitB = insertedColleges.find(c => c.shortName === "IITB")?._id;
    const gla  = insertedColleges.find(c => c.shortName === "GLA")?._id;
    const nitk = insertedColleges.find(c => c.shortName === "NITKKR")?._id;

    await Review.insertMany([
      { collegeId: gla, collegeName: "GLA University, Mathura", studentName: "Deepak Agrawal", email: "deepak.gla@gmail.com", batch: "2022-2026", course: "B.Tech CSE", ratings: { overall: 5, placement: 5, faculty: 5, campus: 5, value: 5 }, rating: 5, title: "Great placements & lush green campus in Mathura", body: "GLA University provides excellent placement opportunities with top companies visiting every season.", message: "Great placements & lush green campus in Mathura", pros: "Top placements, strong faculty, great labs", cons: "Strict discipline", isVerified: true, status: "Active" },
      { collegeId: iitB, collegeName: "IIT Bombay - Indian Institute of Technology [IITB]", studentName: "Aman Gupta", email: "aman.g@gmail.com", batch: "2022-2026", course: "B.Tech CSE", ratings: { overall: 5, placement: 5, faculty: 5, campus: 5, value: 5 }, rating: 5, title: "Unmatched coding environment & high tier placement opportunities", body: "The faculty and research culture at IIT Bombay is top notch.", message: "Unmatched coding environment", pros: "World class labs", cons: "Rigorous workload", isVerified: true, status: "Active" },
      { collegeId: nitk, collegeName: "NIT Kurukshetra - National Institute of Technology", studentName: "Saurabh Sharma", email: "saurabh.nitkkr@gmail.com", batch: "2021-2025", course: "B.Tech ECE", ratings: { overall: 5, placement: 5, faculty: 4, campus: 5, value: 5 }, rating: 4.8, title: "Premier government college experience with awesome peer group", body: "NIT Kurukshetra has outstanding coding culture and Core ECE placement drives.", message: "Awesome campus life & placements", pros: "Low fees, high average packages, tech fests", cons: "Hostel curfew", isVerified: true, status: "Active" },
      { collegeId: gla, collegeName: "GLA University, Mathura", studentName: "Ritu Verma", email: "ritu.v@gmail.com", batch: "2023-2025", course: "MBA Finance", ratings: { overall: 5, placement: 4, faculty: 5, campus: 5, value: 4 }, rating: 4.6, title: "Comprehensive curriculum with practical corporate exposure", body: "The management department conducts weekly industrial visits and guest lectures.", message: "Strong MBA faculty and industry exposure", pros: "Practical training, good library", cons: "Attire norms", isVerified: true, status: "Active" }
    ]);

    // 10. Seed Scholarships (5 items)
    await Scholarship.insertMany([
      { name: "Reliance Foundation Undergraduate Scholarship 2026", provider: "Reliance Foundation", type: "Merit", stream: ["Engineering", "Science", "Commerce"], amount: "₹2,00,000 Total", eligibility: "First year undergraduate students with family income < 15 LPA", description: "Empowering meritorious students pursuing higher education across premier Indian institutions.", officialLink: "https://www.scholarships.reliancefoundation.org", lastDate: new Date("2026-07-31"), status: "Active" },
      { name: "UP Scholarship 2026 (Post Matric & Dashmottar)", provider: "Government of Uttar Pradesh", type: "State", stream: ["Engineering", "Management", "Medical", "Arts"], amount: "100% Tuition Fee Reimbursement", eligibility: "Domicile of UP studying in recognized UP colleges with family income < 2.5 LPA", description: "State scholarship program reimbursing tuition and maintenance allowance for UP students.", officialLink: "https://scholarship.up.gov.in", lastDate: new Date("2026-10-30"), status: "Active" },
      { name: "MHRD Central Sector Scheme of Scholarships", provider: "Ministry of Education (Govt of India)", type: "Central", stream: ["Engineering", "Medical", "Commerce"], amount: "₹12,000 / Year", eligibility: "Above 80th percentile in Class 12th board examinations", description: "Financial support for top performing board students pursuing regular degree courses.", officialLink: "https://scholarships.gov.in", lastDate: new Date("2026-11-15"), status: "Active" },
      { name: "HDFC Bank Parivartan's ECS Scholarship 2026", provider: "HDFC Bank CSR", type: "Need-based", stream: ["Engineering", "Management", "Arts"], amount: "₹75,000 / Year", eligibility: "Students facing personal or financial crisis with family income < 6 LPA", description: "Merit-cum-means scholarship aiding students to prevent dropouts during higher studies.", officialLink: "https://www.hdfcbank.com", lastDate: new Date("2026-08-31"), status: "Active" }
    ]);

    // 11. Seed Study Materials (5 items)
    await StudyMaterial.insertMany([
      { title: "JEE Advanced 10-Year Chapterwise Solved Papers", subject: "Physics, Chemistry & Math", type: "Previous Year", stream: "Engineering", examName: "JEE Advanced", language: "English", downloads: 14200, fileUrl: "https://jeeadv.ac.in", description: "Complete chapterwise previous year question paper archive with detailed step-by-step solutions.", status: "Active" },
      { title: "NEET UG Biology Handcrafted Revision Mindmaps & Formulae", subject: "Botany & Zoology", type: "Notes", stream: "Medical", examName: "NEET UG", language: "English", downloads: 18900, fileUrl: "https://neet.nta.nic.in", description: "Visual high-yield mindmaps covering Class 11 & 12 NCERT Biology chapters.", status: "Active" },
      { title: "CAT Quantitative Aptitude Short Formula Booklet & Mock Sets", subject: "Quantitative Aptitude", type: "Ebook", stream: "Management", examName: "CAT", language: "English", downloads: 9800, fileUrl: "https://iimcat.ac.in", description: "Comprehensive shortcut technique booklet and 5 full-length mock practice sets.", status: "Active" },
      { title: "CUET UG General Test & English Sample Papers 2026", subject: "General Aptitude & Verbal", type: "Sample Paper", stream: "Arts", examName: "CUET UG", language: "English", downloads: 11500, fileUrl: "https://cuetug.ntaonline.in", description: "Official model test papers adhering strictly to the NTA hybrid exam pattern.", status: "Active" }
    ]);

    // 12. Seed Testimonials (5 items)
    await Testimonial.insertMany([
      { studentName: "Arjun Deshpande", role: "Commerce Student", review: "Thanks to College Dakhla, I got into one of the top colleges for my course without any confusion.", status: "Active" },
      { studentName: "Sneha Mukherjee", role: "B.Tech CSE Aspirant", review: "The AI recommendation feature guided me to top ranked engineering colleges in my target city with zero hassle!", status: "Active" },
      { studentName: "Vikramaditya Rao", role: "MBA Candidate", review: "College Dakhla's detailed fee ROI calculator and admission counselor callback gave me complete clarity.", status: "Active" },
      { studentName: "Ananya Sharma", role: "Medical Student", review: "The admission alerts and exam deadline notifications saved me from missing important application windows!", status: "Active" }
    ]);

    console.log("FULL ADMIN MODULE DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();

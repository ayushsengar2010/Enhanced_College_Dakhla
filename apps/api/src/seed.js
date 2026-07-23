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
    console.log("Connecting to MongoDB for full database seeding:", MONGO_URI);
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

    // 1. Seed Streams (10 Streams)
    await Stream.insertMany([
      { streamName: "Engineering", status: "Active" },
      { streamName: "Management", status: "Active" },
      { streamName: "Medical", status: "Active" },
      { streamName: "Commerce", status: "Active" },
      { streamName: "Science", status: "Active" },
      { streamName: "Arts", status: "Active" },
      { streamName: "Design", status: "Active" },
      { streamName: "Pharmacy", status: "Active" },
      { streamName: "Law", status: "Active" },
      { streamName: "Computer Applications", status: "Active" },
    ]);

    // 2. Seed Substreams for EVERY Stream
    await Substream.insertMany([
      // Engineering
      { streamName: "Engineering", substreamName: "Computer Science & Engineering", status: "Active" },
      { streamName: "Engineering", substreamName: "Artificial Intelligence & Data Science", status: "Active" },
      { streamName: "Engineering", substreamName: "Electronics & Communication Engineering", status: "Active" },
      { streamName: "Engineering", substreamName: "Mechanical Engineering", status: "Active" },
      { streamName: "Engineering", substreamName: "Civil Engineering", status: "Active" },
      { streamName: "Engineering", substreamName: "Robotics and Automation", status: "Active" },
      // Management
      { streamName: "Management", substreamName: "Finance & Banking", status: "Active" },
      { streamName: "Management", substreamName: "Marketing & Brand Strategy", status: "Active" },
      { streamName: "Management", substreamName: "Human Resource Management", status: "Active" },
      { streamName: "Management", substreamName: "International Business", status: "Active" },
      { streamName: "Management", substreamName: "Business Analytics & Operations", status: "Active" },
      // Medical
      { streamName: "Medical", substreamName: "General Medicine & Surgery (MBBS)", status: "Active" },
      { streamName: "Medical", substreamName: "Pulmonology & Respiratory Care", status: "Active" },
      { streamName: "Medical", substreamName: "Operation Theatre Technology", status: "Active" },
      { streamName: "Medical", substreamName: "X-Ray Technology & Imaging", status: "Active" },
      { streamName: "Medical", substreamName: "Dental Surgery (BDS)", status: "Active" },
      // Commerce
      { streamName: "Commerce", substreamName: "Accounting & Finance", status: "Active" },
      { streamName: "Commerce", substreamName: "Banking & Insurance", status: "Active" },
      { streamName: "Commerce", substreamName: "Financial Markets", status: "Active" },
      // Science
      { streamName: "Science", substreamName: "Physics & Quantum Sciences", status: "Active" },
      { streamName: "Science", substreamName: "Chemistry & Chemical Sciences", status: "Active" },
      { streamName: "Science", substreamName: "Biotechnology & Microbiology", status: "Active" },
      // Arts
      { streamName: "Arts", substreamName: "Physical Geography & Environmental Studies", status: "Active" },
      { streamName: "Arts", substreamName: "Broadcast Journalism & Mass Communication", status: "Active" },
      { streamName: "Arts", substreamName: "Office Management and Secretarial Practice", status: "Active" },
      { streamName: "Arts", substreamName: "Psychology & Behavioral Sciences", status: "Active" },
      // Design
      { streamName: "Design", substreamName: "Animation and VFX", status: "Active" },
      { streamName: "Design", substreamName: "Fashion & Textile Design", status: "Active" },
      { streamName: "Design", substreamName: "UI/UX & Digital Product Design", status: "Active" },
      // Pharmacy
      { streamName: "Pharmacy", substreamName: "Pharmaceutics & Drug Design", status: "Active" },
      { streamName: "Pharmacy", substreamName: "Pharmacology & Clinical Research", status: "Active" },
      // Law
      { streamName: "Law", substreamName: "Corporate & Business Law", status: "Active" },
      { streamName: "Law", substreamName: "Criminal Law & Criminology", status: "Active" },
      { streamName: "Law", substreamName: "Cyber Law & Technology Regulation", status: "Active" },
      // Computer Applications
      { streamName: "Computer Applications", substreamName: "Software Development & Web Technologies", status: "Active" },
      { streamName: "Computer Applications", substreamName: "Data Science & Analytics", status: "Active" },
      { streamName: "Computer Applications", substreamName: "Cloud Computing & DevOps", status: "Active" },
    ]);

    // 3. Seed Course Durations
    await CourseDuration.insertMany([
      { duration: "5 Years", status: "Active" },
      { duration: "4 Years", status: "Active" },
      { duration: "3 Years", status: "Active" },
      { duration: "2 Years", status: "Active" },
      { duration: "1 Year", status: "Active" },
    ]);

    // 4. Seed Courses across ALL Streams & Substreams
    const insertedCourses = await Course.insertMany([
      // Engineering
      { courseName: "B.Tech Computer Science and Engineering", stream: "Engineering", subStream: "Computer Science & Engineering", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM with 75% aggregate", entranceExam: "JEE Main / Advanced", feeAmount: "220000/Yr", courseReview: "4.9/5", status: "Active" },
      { courseName: "B.Tech Artificial Intelligence and Machine Learning", stream: "Engineering", subStream: "Artificial Intelligence & Data Science", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM with 75% aggregate", entranceExam: "JEE Main / Advanced", feeAmount: "240000/Yr", courseReview: "4.8/5", status: "Active" },
      { courseName: "B.Tech Electronics and Communication", stream: "Engineering", subStream: "Electronics & Communication Engineering", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM with 60%", entranceExam: "JEE Main / MET", feeAmount: "210000/Yr", courseReview: "4.6/5", status: "Active" },
      { courseName: "B.Tech Mechanical Engineering", stream: "Engineering", subStream: "Mechanical Engineering", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM", entranceExam: "JEE Main", feeAmount: "200000/Yr", courseReview: "4.5/5", status: "Active" },
      { courseName: "B.Tech Robotics and Automation", stream: "Engineering", subStream: "Robotics and Automation", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM with 65%", entranceExam: "JEE Main / BITSAT", feeAmount: "250000/Yr", courseReview: "4.7/5", status: "Active" },
      { courseName: "B.Tech Civil Engineering", stream: "Engineering", subStream: "Civil Engineering", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCM with 60%", entranceExam: "JEE Main", feeAmount: "190000/Yr", courseReview: "4.4/5", status: "Active" },

      // Management
      { courseName: "MBA Finance and Investment Banking", stream: "Management", subStream: "Finance & Banking", courseType: "Masters", duration: "2 Years", eligibility: "Bachelor's Degree with 50%", entranceExam: "CAT / XAT / GMAT", feeAmount: "450000/Yr", courseReview: "4.9/5", status: "Active" },
      { courseName: "MBA Marketing and Brand Strategy", stream: "Management", subStream: "Marketing & Brand Strategy", courseType: "Masters", duration: "2 Years", eligibility: "Bachelor's Degree in any field", entranceExam: "CAT / MAT / CMAT", feeAmount: "420000/Yr", courseReview: "4.7/5", status: "Active" },
      { courseName: "MBA Human Resource Management", stream: "Management", subStream: "Human Resource Management", courseType: "Masters", duration: "2 Years", eligibility: "Graduation with 50%", entranceExam: "CAT / NMAT", feeAmount: "400000/Yr", courseReview: "4.6/5", status: "Active" },
      { courseName: "BBA International Business", stream: "Management", subStream: "International Business", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Any Recognized Board", entranceExam: "CUET UG / IPMAT", feeAmount: "135000/Yr", courseReview: "4.5/5", status: "Active" },
      { courseName: "MBA Business Analytics", stream: "Management", subStream: "Business Analytics & Operations", courseType: "Masters", duration: "2 Years", eligibility: "Bachelor's with Mathematics/Stats", entranceExam: "CAT / GMAT", feeAmount: "500000/Yr", courseReview: "4.8/5", status: "Active" },

      // Medical
      { courseName: "MBBS Bachelor of Medicine and Surgery", stream: "Medical", subStream: "General Medicine & Surgery (MBBS)", courseType: "Bachelors", duration: "5 Years", eligibility: "10+2 PCB with 50% aggregate", entranceExam: "NEET UG", feeAmount: "135000/Yr", courseReview: "5.0/5", status: "Active" },
      { courseName: "B.Sc Operation Theatre Technology", stream: "Medical", subStream: "Operation Theatre Technology", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 PCB", entranceExam: "NEET / University Entrance", feeAmount: "90000/Yr", courseReview: "4.4/5", status: "Active" },
      { courseName: "BDS Bachelor of Dental Surgery", stream: "Medical", subStream: "Dental Surgery (BDS)", courseType: "Bachelors", duration: "5 Years", eligibility: "10+2 PCB", entranceExam: "NEET UG", feeAmount: "250000/Yr", courseReview: "4.6/5", status: "Active" },
      { courseName: "B.Sc X-Ray and Radiology Technology", stream: "Medical", subStream: "X-Ray Technology & Imaging", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 PCB", entranceExam: "State Medical Entrance", feeAmount: "85000/Yr", courseReview: "4.3/5", status: "Active" },

      // Commerce
      { courseName: "B.Com Honours Accounting & Finance", stream: "Commerce", subStream: "Accounting & Finance", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Commerce with Math", entranceExam: "CUET UG", feeAmount: "85000/Yr", courseReview: "4.6/5", status: "Active" },
      { courseName: "B.Com Banking & Insurance", stream: "Commerce", subStream: "Banking & Insurance", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Commerce", entranceExam: "CUET UG", feeAmount: "75000/Yr", courseReview: "4.4/5", status: "Active" },
      { courseName: "M.Com Financial Markets", stream: "Commerce", subStream: "Financial Markets", courseType: "Masters", duration: "2 Years", eligibility: "B.Com Degree", entranceExam: "CUET PG", feeAmount: "95000/Yr", courseReview: "4.5/5", status: "Active" },

      // Science
      { courseName: "B.Sc Honours Physics", stream: "Science", subStream: "Physics & Quantum Sciences", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 PCM", entranceExam: "CUET UG", feeAmount: "60000/Yr", courseReview: "4.7/5", status: "Active" },
      { courseName: "B.Sc Biotechnology", stream: "Science", subStream: "Biotechnology & Microbiology", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 PCB / PCM", entranceExam: "CUET UG", feeAmount: "110000/Yr", courseReview: "4.6/5", status: "Active" },
      { courseName: "M.Sc Chemistry", stream: "Science", subStream: "Chemistry & Chemical Sciences", courseType: "Masters", duration: "2 Years", eligibility: "B.Sc Chemistry", entranceExam: "CUET PG / IIT JAM", feeAmount: "70000/Yr", courseReview: "4.6/5", status: "Active" },

      // Arts
      { courseName: "BA Economics Honours", stream: "Arts", subStream: "Physical Geography & Environmental Studies", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Any Stream", entranceExam: "CUET UG", feeAmount: "65000/Yr", courseReview: "4.7/5", status: "Active" },
      { courseName: "BA Journalism and Mass Communication", stream: "Arts", subStream: "Broadcast Journalism & Mass Communication", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Any Stream", entranceExam: "CUET UG / University Test", feeAmount: "95000/Yr", courseReview: "4.6/5", status: "Active" },
      { courseName: "BA Applied Psychology", stream: "Arts", subStream: "Psychology & Behavioral Sciences", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Any Stream", entranceExam: "CUET UG", feeAmount: "70000/Yr", courseReview: "4.8/5", status: "Active" },

      // Design
      { courseName: "B.Des Animation and VFX", stream: "Design", subStream: "Animation and VFX", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 Any Stream", entranceExam: "NID DAT / UCEED / NIFT", feeAmount: "300000/Yr", courseReview: "4.8/5", status: "Active" },
      { courseName: "B.Des Fashion and Textile Design", stream: "Design", subStream: "Fashion & Textile Design", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 Any Stream", entranceExam: "NIFT Entrance Exam", feeAmount: "280000/Yr", courseReview: "4.7/5", status: "Active" },
      { courseName: "B.Des UI/UX Digital Product Design", stream: "Design", subStream: "UI/UX & Digital Product Design", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 Any Stream", entranceExam: "UCEED / NID", feeAmount: "320000/Yr", courseReview: "4.9/5", status: "Active" },

      // Pharmacy
      { courseName: "B.Pharm Bachelor of Pharmacy", stream: "Pharmacy", subStream: "Pharmaceutics & Drug Design", courseType: "Bachelors", duration: "4 Years", eligibility: "10+2 PCB / PCM", entranceExam: "NEET / State CET", feeAmount: "110000/Yr", courseReview: "4.5/5", status: "Active" },
      { courseName: "M.Pharm Pharmacology", stream: "Pharmacy", subStream: "Pharmacology & Clinical Research", courseType: "Masters", duration: "2 Years", eligibility: "B.Pharm Degree", entranceExam: "GPAT", feeAmount: "140000/Yr", courseReview: "4.7/5", status: "Active" },

      // Law
      { courseName: "BA LLB Integrated Corporate Law", stream: "Law", subStream: "Corporate & Business Law", courseType: "Bachelors", duration: "5 Years", eligibility: "10+2 Any Stream with 45%", entranceExam: "CLAT / AILET", feeAmount: "210000/Yr", courseReview: "4.8/5", status: "Active" },
      { courseName: "BBA LLB Criminal & Cyber Law", stream: "Law", subStream: "Cyber Law & Technology Regulation", courseType: "Bachelors", duration: "5 Years", eligibility: "10+2 Any Stream", entranceExam: "CLAT / LSAT India", feeAmount: "220000/Yr", courseReview: "4.7/5", status: "Active" },

      // Computer Applications
      { courseName: "BCA Software Development", stream: "Computer Applications", subStream: "Software Development & Web Technologies", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Any Stream with Math/CS", entranceExam: "CUET UG / University Entrance", feeAmount: "95000/Yr", courseReview: "4.7/5", status: "Active" },
      { courseName: "MCA Data Science & Big Data", stream: "Computer Applications", subStream: "Data Science & Analytics", courseType: "Masters", duration: "2 Years", eligibility: "BCA / B.Sc CS", entranceExam: "NIMCET / CUET PG", feeAmount: "130000/Yr", courseReview: "4.8/5", status: "Active" },
      { courseName: "BCA Cloud Computing & Cybersecurity", stream: "Computer Applications", subStream: "Cloud Computing & DevOps", courseType: "Bachelors", duration: "3 Years", eligibility: "10+2 Any Stream", entranceExam: "Direct / Entrance Test", feeAmount: "110000/Yr", courseReview: "4.6/5", status: "Active" },
    ]);

    const cIds = insertedCourses.map(c => c._id);

    // 5. Seed 45+ Genuine Colleges across India covering EVERY stream & substream
    const insertedColleges = await College.insertMany([
      // --- MATHURA, UTTAR PRADESH ---
      { collegeName: "GLA University, Mathura", shortName: "GLA", slug: "gla-university-mathura", location: "Mathura, Uttar Pradesh", city: "Mathura", state: "Uttar Pradesh", category: "Private", ranking: 15, fees: 185000, highestPackage: "₹55 LPA", rating: 4.6, bestFor: "NAAC A+ Grade, Top Ranked University in Mathura UP", cutoffExam: "CUET / GLAET / JEE Main", cutoffScore: "Score ~ 75%", userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "BSA College of Engineering & Technology, Mathura", shortName: "BSACET", slug: "bsa-college-mathura", location: "Mathura, Uttar Pradesh", city: "Mathura", state: "Uttar Pradesh", category: "Private", ranking: 45, fees: 95000, highestPackage: "₹18 LPA", rating: 4.2, bestFor: "Premier AKTU Affiliated Institute in Mathura", cutoffExam: "JEE Main / UPTAC", cutoffScore: "Rank ~ 65000", userReviews: "4.2/5", status: "Active", courses: cIds },
      { collegeName: "Sanskriti University, Mathura", shortName: "SU", slug: "sanskriti-university-mathura", location: "Mathura, Uttar Pradesh", city: "Mathura", state: "Uttar Pradesh", category: "Private", ranking: 38, fees: 130000, highestPackage: "₹28 LPA", rating: 4.3, bestFor: "30+ Acre Ultra Modern Campus in Mathura", cutoffExam: "SEEE / CUET / JEE Main", cutoffScore: "Score ~ 70%", userReviews: "4.3/5", status: "Active", courses: cIds },

      // --- NOIDA & GREATER NOIDA, UTTAR PRADESH ---
      { collegeName: "Shiv Nadar University, Noida", shortName: "SNU", slug: "shiv-nadar-university", location: "Noida, Uttar Pradesh", city: "Noida", state: "Uttar Pradesh", category: "Private", ranking: 2, fees: 650000, highestPackage: "₹58 LPA", rating: 4.8, bestFor: "Multidisciplinary Research & Innovation Leader", cutoffExam: "JEE Main / SNUSAT", cutoffScore: "JEE Main Rank ~ 25,000", userReviews: "4.8/5", status: "Active", courses: cIds },
      { collegeName: "Amity University, Noida", shortName: "AMITY", slug: "amity-noida", location: "Noida, Uttar Pradesh", city: "Noida", state: "Uttar Pradesh", category: "Private", ranking: 18, fees: 310000, highestPackage: "₹61.75 LPA", rating: 4.3, bestFor: "Global Campuses and Industry Tie-ups", cutoffExam: "Direct / Amity JEE", cutoffScore: "Score ~ 80%", userReviews: "4.3/5", status: "Active", courses: cIds },
      { collegeName: "JSS Academy of Technical Education, Noida", shortName: "JSSATE", slug: "jss-noida", location: "Noida, Uttar Pradesh", city: "Noida", state: "Uttar Pradesh", category: "Private", ranking: 25, fees: 140000, highestPackage: "₹40 LPA", rating: 4.4, bestFor: "Top Ranked AKTU College in Noida NCR", cutoffExam: "JEE Main / UPTAC", cutoffScore: "JEE Main Rank ~ 35,000", userReviews: "4.4/5", status: "Active", courses: cIds },
      { collegeName: "Galgotias University, Greater Noida", shortName: "GU", slug: "galgotias-university", location: "Greater Noida, Uttar Pradesh", city: "Greater Noida", state: "Uttar Pradesh", category: "Private", ranking: 12, fees: 160000, highestPackage: "₹1.5 CPA", rating: 4.5, bestFor: "100% Placement Assistance & Industry Partners", cutoffExam: "GEEE / CUET / JEE Main", cutoffScore: "Score ~ 75%", userReviews: "4.5/5", status: "Active", courses: cIds },
      { collegeName: "Sharda University, Greater Noida", shortName: "SU", slug: "sharda-university", location: "Greater Noida, Uttar Pradesh", city: "Greater Noida", state: "Uttar Pradesh", category: "Private", ranking: 20, fees: 220000, highestPackage: "₹48 LPA", rating: 4.3, bestFor: "International Students Hub & Global Exposure", cutoffExam: "SUAT / JEE Main", cutoffScore: "Score ~ 70%", userReviews: "4.3/5", status: "Active", courses: cIds },
      { collegeName: "Bennett University, Greater Noida", shortName: "BU", slug: "bennett-university", location: "Greater Noida, Uttar Pradesh", city: "Greater Noida", state: "Uttar Pradesh", category: "Private", ranking: 14, fees: 360000, highestPackage: "₹57 LPA", rating: 4.6, bestFor: "Times Group Backed Ivy-League Style Education", cutoffExam: "JEE Main / SAT", cutoffScore: "Percentile ~ 80%", userReviews: "4.6/5", status: "Active", courses: cIds },

      // --- KANPUR, LUCKNOW & VARANASI, UTTAR PRADESH ---
      { collegeName: "IIT Kanpur - Indian Institute of Technology [IITK]", shortName: "IITK", slug: "iit-kanpur", location: "Kanpur, Uttar Pradesh", city: "Kanpur", state: "Uttar Pradesh", category: "Government", ranking: 4, fees: 215000, highestPackage: "₹1.9 CPA", rating: 4.9, bestFor: "Ranked 4 NIRF, Premier Engineering & Science Institute", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 215", userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "HBTU Kanpur - Harcourt Butler Technical University", shortName: "HBTU", slug: "hbtu-kanpur", location: "Kanpur, Uttar Pradesh", city: "Kanpur", state: "Uttar Pradesh", category: "Government", ranking: 22, fees: 135000, highestPackage: "₹44 LPA", rating: 4.5, bestFor: "Historical Premier Technical Institution in UP", cutoffExam: "JEE Main / UPTAC", cutoffScore: "JEE Main Rank ~ 25,000", userReviews: "4.5/5", status: "Active", courses: cIds },
      { collegeName: "PSIT Kanpur - Pranveer Singh Institute of Technology", shortName: "PSIT", slug: "psit-kanpur", location: "Kanpur, Uttar Pradesh", city: "Kanpur", state: "Uttar Pradesh", category: "Private", ranking: 30, fees: 125000, highestPackage: "₹40 LPA", rating: 4.4, bestFor: "Top Corporate Placements in Central UP", cutoffExam: "JEE Main / UPTAC", cutoffScore: "Rank ~ 50000", userReviews: "4.4/5", status: "Active", courses: cIds },
      { collegeName: "IIM Lucknow - Indian Institute of Management", shortName: "IIML", slug: "iim-lucknow", location: "Lucknow, Uttar Pradesh", city: "Lucknow", state: "Uttar Pradesh", category: "Government", ranking: 5, fees: 1075000, highestPackage: "₹1.0 CPA", rating: 4.9, bestFor: "Top Premier Business School in North India", cutoffExam: "CAT", cutoffScore: "Percentile ~ 99", userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "IET Lucknow - Institute of Engineering and Technology", shortName: "IET", slug: "iet-lucknow", location: "Lucknow, Uttar Pradesh", city: "Lucknow", state: "Uttar Pradesh", category: "Government", ranking: 24, fees: 85000, highestPackage: "₹49 LPA", rating: 4.6, bestFor: "Top Autonomous Engineering College under AKTU", cutoffExam: "JEE Main / UPTAC", cutoffScore: "Rank ~ 20000", userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "IIT BHU Varanasi - Indian Institute of Technology", shortName: "IIT BHU", slug: "iit-bhu-varanasi", location: "Varanasi, Uttar Pradesh", city: "Varanasi", state: "Uttar Pradesh", category: "Government", ranking: 9, fees: 220000, highestPackage: "₹1.2 CPA", rating: 4.8, bestFor: "Heritage Technical Institute inside BHU Campus", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 1000", userReviews: "4.8/5", status: "Active", courses: cIds },
      { collegeName: "Banaras Hindu University [BHU], Varanasi", shortName: "BHU", slug: "bhu-varanasi", location: "Varanasi, Uttar Pradesh", city: "Varanasi", state: "Uttar Pradesh", category: "Government", ranking: 6, fees: 12000, highestPackage: "₹38 LPA", rating: 4.8, bestFor: "World-Renowned Central University", cutoffExam: "CUET UG / NEET", cutoffScore: "Score ~ 95%", userReviews: "4.8/5", status: "Active", courses: cIds },

      // --- DELHI NCR (NEW DELHI) ---
      { collegeName: "IIT Delhi - Indian Institute of Technology [IITD]", shortName: "IITD", slug: "iit-delhi", location: "New Delhi, Delhi NCR", city: "New Delhi", state: "Delhi", category: "Government", ranking: 2, fees: 220000, highestPackage: "₹2.0 CPA", rating: 4.9, bestFor: "Ranked 2 NIRF National Leader", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 100", userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "DTU Delhi - Delhi Technological University", shortName: "DTU", slug: "dtu-delhi-main", location: "New Delhi, Delhi NCR", city: "New Delhi", state: "Delhi", category: "Government", ranking: 12, fees: 219000, highestPackage: "₹64.2 LPA", rating: 4.7, bestFor: "Premier State Technical University", cutoffExam: "JEE Main / JAC Delhi", cutoffScore: "Rank ~ 6000", userReviews: "4.7/5", status: "Active", courses: cIds },
      { collegeName: "Jamia Millia Islamia [JMI], New Delhi", shortName: "JMI", slug: "jmi-new-delhi", location: "New Delhi, Delhi NCR", city: "New Delhi", state: "Delhi", category: "Government", ranking: 19, fees: 45000, highestPackage: "₹25 LPA", rating: 4.7, bestFor: "Top Central University with Low Fees", cutoffExam: "JEE Main / CUET", cutoffScore: "Rank ~ 25000", userReviews: "4.7/5", status: "Active", courses: cIds },
      { collegeName: "National Law University [NLU], New Delhi", shortName: "NLUD", slug: "nlu-new-delhi", location: "New Delhi, Delhi NCR", city: "New Delhi", state: "Delhi", category: "Government", ranking: 2, fees: 180000, highestPackage: "₹24 LPA", rating: 4.9, bestFor: "Premier Law Institute in India", cutoffExam: "AILET", cutoffScore: "AIR ~ 80", userReviews: "4.9/5", status: "Active", courses: cIds },

      // --- MUMBAI & PUNE, MAHARASHTRA ---
      { collegeName: "IIT Bombay - Indian Institute of Technology [IITB]", shortName: "IITB", slug: "iit-bombay", location: "Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", category: "Government", ranking: 3, fees: 218000, highestPackage: "₹3.67 CPA", rating: 4.9, bestFor: "Ranked 3 NIRF Institute", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 60", userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "VJTI Mumbai - Veermata Jijabai Technological Institute", shortName: "VJTI", slug: "vjti-mumbai", location: "Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", category: "Government", ranking: 13, fees: 85000, highestPackage: "₹62 LPA", rating: 4.7, bestFor: "Top Autonomous Engineering Institute in Maharashtra", cutoffExam: "MHT CET / JEE Main", cutoffScore: "MHT CET Percentile ~ 99.5", userReviews: "4.7/5", status: "Active", courses: cIds },
      { collegeName: "NMIMS University, Mumbai", shortName: "NMIMS", slug: "nmims-mumbai", location: "Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", category: "Private", ranking: 15, fees: 350000, highestPackage: "₹45 LPA", rating: 4.6, bestFor: "Premier Management & Law Campus in Mumbai", cutoffExam: "NMAT / NPAT / CLAT", cutoffScore: "NMAT Score ~ 235", userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "COEP Technological University, Pune", shortName: "COEP", slug: "coep-pune", location: "Pune, Maharashtra", city: "Pune", state: "Maharashtra", category: "Government", ranking: 10, fees: 95000, highestPackage: "₹50 LPA", rating: 4.8, bestFor: "3rd Oldest Engineering College in Asia", cutoffExam: "MHT CET / JEE Main", cutoffScore: "MHT CET Percentile ~ 99.6", userReviews: "4.8/5", status: "Active", courses: cIds },
      { collegeName: "Symbiosis International University [SIU], Pune", shortName: "SIU", slug: "symbiosis-pune", location: "Pune, Maharashtra", city: "Pune", state: "Maharashtra", category: "Private", ranking: 14, fees: 420000, highestPackage: "₹38 LPA", rating: 4.7, bestFor: "Top Private University for Law, Management & CS", cutoffExam: "SNAP / SET / SLAT", cutoffScore: "Percentile ~ 98", userReviews: "4.7/5", status: "Active", courses: cIds },

      // --- BANGALORE, KARNATAKA ---
      { collegeName: "IISc Bangalore - Indian Institute of Science", shortName: "IISC", slug: "iisc-bangalore", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", category: "Government", ranking: 1, fees: 35000, highestPackage: "₹86 LPA", rating: 4.9, bestFor: "India's #1 Ranked Science & Research University", cutoffExam: "JEE Advanced / NEET / GATE", cutoffScore: "AIR ~ 250", userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "RV College of Engineering [RVCE], Bangalore", shortName: "RVCE", slug: "rvce-bangalore", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", category: "Private", ranking: 11, fees: 240000, highestPackage: "₹92 LPA", rating: 4.8, bestFor: "Silicon Valley Placement Record in Bangalore", cutoffExam: "KCET / COMEDK", cutoffScore: "COMEDK Rank ~ 500", userReviews: "4.8/5", status: "Active", courses: cIds },
      { collegeName: "BMS College of Engineering [BMSCE], Bangalore", shortName: "BMSCE", slug: "bmsce-bangalore", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", category: "Private", ranking: 16, fees: 220000, highestPackage: "₹50 LPA", rating: 4.6, bestFor: "Heritage Autonomous Technical College", cutoffExam: "KCET / COMEDK", cutoffScore: "Rank ~ 1200", userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "NLSIU Bangalore - National Law School of India University", shortName: "NLSIU", slug: "nlsiu-bangalore", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", category: "Government", ranking: 1, fees: 280000, highestPackage: "₹28 LPA", rating: 5.0, bestFor: "India's #1 Ranked Law School", cutoffExam: "CLAT", cutoffScore: "AIR ~ 95", userReviews: "5.0/5", status: "Active", courses: cIds },

      // --- CHENNAI & TAMIL NADU ---
      { collegeName: "IIT Madras - Indian Institute of Technology [IITM]", shortName: "IITM", slug: "iit-madras", location: "Chennai, Tamil Nadu", city: "Chennai", state: "Tamil Nadu", category: "Government", ranking: 1, fees: 212000, highestPackage: "₹1.98 CPA", rating: 4.9, bestFor: "#1 Overall NIRF Ranked University in India", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 150", userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "SRM Institute of Science and Technology, Chennai", shortName: "SRM", slug: "srm-chennai", location: "Chennai, Tamil Nadu", city: "Chennai", state: "Tamil Nadu", category: "Private", ranking: 21, fees: 275000, highestPackage: "₹1.0 CPA", rating: 4.5, bestFor: "Top Private Deemed University in South India", cutoffExam: "SRMJEEE / JEE Main", cutoffScore: "Rank ~ 5000", userReviews: "4.5/5", status: "Active", courses: cIds },
      { collegeName: "VIT Vellore - Vellore Institute of Technology", shortName: "VIT", slug: "vit-vellore", location: "Vellore, Tamil Nadu", city: "Vellore", state: "Tamil Nadu", category: "Private", ranking: 8, fees: 198000, highestPackage: "₹1.02 CPA", rating: 4.7, bestFor: "NAAC A++ Deemed University with Global Placements", cutoffExam: "VITEEE", cutoffScore: "Rank ~ 7000", userReviews: "4.7/5", status: "Active", courses: cIds },

      // --- HYDERABAD & TELANGANA ---
      { collegeName: "IIT Hyderabad - Indian Institute of Technology", shortName: "IITH", slug: "iit-hyderabad", location: "Hyderabad, Telangana", city: "Hyderabad", state: "Telangana", category: "Government", ranking: 8, fees: 225000, highestPackage: "₹90 LPA", rating: 4.8, bestFor: "Rapidly Growing Tech & Innovation Center", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 600", userReviews: "4.8/5", status: "Active", courses: cIds },
      { collegeName: "BITS Pilani Hyderabad Campus", shortName: "BITS Hyd", slug: "bits-hyderabad", location: "Hyderabad, Telangana", city: "Hyderabad", state: "Telangana", category: "Private", ranking: 15, fees: 540000, highestPackage: "₹60 LPA", rating: 4.7, bestFor: "Premier Merit-Based Engineering Campus", cutoffExam: "BITSAT", cutoffScore: "Score ~ 295", userReviews: "4.7/5", status: "Active", courses: cIds },

      // --- AHMEDABAD & GUJARAT ---
      { collegeName: "IIM Ahmedabad - Indian Institute of Management", shortName: "IIMA", slug: "iim-ahmedabad", location: "Ahmedabad, Gujarat", city: "Ahmedabad", state: "Gujarat", category: "Government", ranking: 1, fees: 2500000, highestPackage: "₹1.1 CPA", rating: 5.0, bestFor: "India's #1 Ranked Business School", cutoffExam: "CAT", cutoffScore: "Percentile ~ 99.5", userReviews: "5.0/5", status: "Active", courses: cIds },
      { collegeName: "Nirma University, Ahmedabad", shortName: "NIRMA", slug: "nirma-university", location: "Ahmedabad, Gujarat", city: "Ahmedabad", state: "Gujarat", category: "Private", ranking: 27, fees: 210000, highestPackage: "₹52 LPA", rating: 4.5, bestFor: "Top Ranked Private Campus in Gujarat", cutoffExam: "JEE Main / GUJCET / CAT", cutoffScore: "Percentile ~ 95", userReviews: "4.5/5", status: "Active", courses: cIds },

      // --- JAIPUR & RAJASTHAN ---
      { collegeName: "MNIT Jaipur - Malaviya National Institute of Technology", shortName: "MNITJ", slug: "mnit-jaipur", location: "Jaipur, Rajasthan", city: "Jaipur", state: "Rajasthan", category: "Government", ranking: 16, fees: 175000, highestPackage: "₹64 LPA", rating: 4.6, bestFor: "Premier NIT in Pink City Jaipur", cutoffExam: "JEE Main", cutoffScore: "Rank ~ 9000", userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "BITS Pilani - Birla Institute of Technology and Science", shortName: "BITS", slug: "bits-pilani-main", location: "Pilani, Rajasthan", city: "Pilani", state: "Rajasthan", category: "Private", ranking: 11, fees: 540000, highestPackage: "₹60.7 LPA", rating: 4.8, bestFor: "Top Ranked Private Engineering Institute", cutoffExam: "BITSAT", cutoffScore: "Score ~ 320", userReviews: "4.8/5", status: "Active", courses: cIds },

      // --- KOLKATA & WEST BENGAL ---
      { collegeName: "IIT Kharagpur - Indian Institute of Technology", shortName: "IIT KGP", slug: "iit-kharagpur", location: "Kharagpur, West Bengal", city: "Kharagpur", state: "West Bengal", category: "Government", ranking: 5, fees: 224000, highestPackage: "₹2.68 CPA", rating: 4.9, bestFor: "1st & Largest IIT in India", cutoffExam: "JEE Advanced", cutoffScore: "AIR ~ 300", userReviews: "4.9/5", status: "Active", courses: cIds },
      { collegeName: "Jadavpur University, Kolkata", shortName: "JU", slug: "jadavpur-university", location: "Kolkata, West Bengal", city: "Kolkata", state: "West Bengal", category: "Government", ranking: 10, fees: 10000, highestPackage: "₹85 LPA", rating: 4.8, bestFor: "Highest ROI State University in East India", cutoffExam: "WBJEE", cutoffScore: "WBJEE Rank ~ 150", userReviews: "4.8/5", status: "Active", courses: cIds },

      // --- CHANDIGARH & PUNJAB ---
      { collegeName: "PEC Chandigarh - Punjab Engineering College", shortName: "PEC", slug: "pec-chandigarh", location: "Chandigarh, Punjab", city: "Chandigarh", state: "Punjab", category: "Government", ranking: 23, fees: 190000, highestPackage: "₹83 LPA", rating: 4.6, bestFor: "Centrally Funded Heritage Engineering Institute", cutoffExam: "JEE Main / JAC Chandigarh", cutoffScore: "Rank ~ 12000", userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "Thapar Institute of Engineering and Technology, Patiala", shortName: "TIET", slug: "thapar-university", location: "Patiala, Punjab", city: "Patiala", state: "Punjab", category: "Private", ranking: 18, fees: 340000, highestPackage: "₹55 LPA", rating: 4.6, bestFor: "NAAC A+ Deemed Technical Campus", cutoffExam: "JEE Main / Merit", cutoffScore: "Percentile ~ 90", userReviews: "4.6/5", status: "Active", courses: cIds },

      // --- HARYANA PRESERVED ---
      { collegeName: "St Andrews Institute of Technology & Management (SAITM)", shortName: "SAITM", slug: "saitm-gurugram", location: "Gurugram, Haryana", city: "Gurugram", state: "Haryana", category: "Private", ranking: 10, fees: 220000, highestPackage: "₹28 LPA", rating: 3.9, cutoffExam: "JEE Main / HSTES", cutoffScore: "JEE Main Rank ~ 5,15,000", userReviews: "3.9/5", status: "Active", courses: cIds },
      { collegeName: "NIT Kurukshetra - National Institute of Technology", shortName: "NITKKR", slug: "nit-kurukshetra", location: "Kurukshetra, Haryana", city: "Kurukshetra", state: "Haryana", category: "Government", ranking: 8, fees: 180000, highestPackage: "₹51 LPA", rating: 4.6, bestFor: "Institute of National Importance in Haryana", cutoffExam: "JEE Main / DASA", cutoffScore: "JEE Main Rank ~ 8,500", userReviews: "4.6/5", status: "Active", courses: cIds },
      { collegeName: "JC Bose University YMCA, Faridabad", shortName: "YMCA", slug: "ymca-faridabad", location: "Faridabad, Haryana", city: "Faridabad", state: "Haryana", category: "Government", ranking: 14, fees: 110000, highestPackage: "₹35 LPA", rating: 4.4, bestFor: "Premier State Technical University in Haryana", cutoffExam: "JEE Main / HSTES", cutoffScore: "JEE Main Rank ~ 35,000", userReviews: "4.4/5", status: "Active", courses: cIds },
      { collegeName: "Ashoka University, Sonepat", shortName: "ASHOKA", slug: "ashoka-university", location: "Sonepat, Haryana", city: "Sonepat", state: "Haryana", category: "Private", ranking: 16, fees: 950000, highestPackage: "₹40 LPA", rating: 4.7, bestFor: "Top Premier Liberal Arts & Sciences University", cutoffExam: "Ashoka Aptitude Test (AAT)", cutoffScore: "Score ~ 85%", userReviews: "4.7/5", status: "Active", courses: cIds }
    ]);

    // 6. Seed Entrance Exams
    await Exam.insertMany([
      { examName: "JEE Main 2026", slug: "jee-main-2026", shortName: "JEE Main", stream: "Engineering", conductingBody: "National Testing Agency (NTA)", examLevel: "National", examMode: "Online Exam", participatingCollegesCount: 1986, description: "Joint Entrance Examination Main for admission to NITs, IIITs, and CFTIs.", eligibility: "10+2 with Physics, Chemistry, and Mathematics", syllabus: "Physics, Chemistry, and Mathematics of Class 11th and 12th CBSE curriculum", examPattern: "75 Multiple Choice and Numerical Questions across PCM", officialWebsite: "https://jeemain.nta.ac.in", applicationFee: 1000, status: "Active" },
      { examName: "JEE Advanced 2026", slug: "jee-advanced-2026", shortName: "JEE Adv", stream: "Engineering", conductingBody: "IIT Kanpur", examLevel: "National", examMode: "Online Exam", participatingCollegesCount: 31, description: "Premier entrance exam for admissions into 23 Indian Institutes of Technology (IITs).", eligibility: "Top 2,500,000 rankers in JEE Main 2026", syllabus: "Advanced level concepts in Physics, Chemistry, and Mathematics", examPattern: "Two papers of 3 hours duration each", officialWebsite: "https://jeeadv.ac.in", applicationFee: 3200, status: "Active" },
      { examName: "NEET UG 2026", slug: "neet-ug-2026", shortName: "NEET", stream: "Medical", conductingBody: "National Testing Agency (NTA)", examLevel: "National", examMode: "Offline Pen-Paper", participatingCollegesCount: 650, description: "Single national level entrance test for MBBS, BDS, and AYUSH courses.", eligibility: "10+2 with Physics, Chemistry, Biology with 50% aggregate", syllabus: "Physics, Chemistry, Botany, and Zoology of 11th & 12th standard", examPattern: "200 Multiple Choice Questions (180 to be attempted)", officialWebsite: "https://neet.nta.nic.in", applicationFee: 1700, status: "Active" },
      { examName: "CAT 2026 - Common Admission Test", slug: "cat-2026", shortName: "CAT", stream: "Management", conductingBody: "IIM Ahmedabad", examLevel: "National", examMode: "Computer Based Test", participatingCollegesCount: 1200, description: "Premier entrance examination for admission into IIMs and top B-Schools across India.", eligibility: "Bachelor's Degree with at least 50% marks", syllabus: "VARC, DILR, and Quantitative Aptitude", examPattern: "66 Questions across 3 timed sections (2 Hours)", officialWebsite: "https://iimcat.ac.in", applicationFee: 2400, status: "Active" },
      { examName: "CLAT 2026 - Common Law Admission Test", slug: "clat-2026", shortName: "CLAT", stream: "Law", conductingBody: "Consortium of NLUs", examLevel: "National", examMode: "Offline Exam", participatingCollegesCount: 24, description: "National entrance exam for admissions into 24 National Law Universities in India.", eligibility: "10+2 with minimum 45% marks", syllabus: "English, Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative Techniques", examPattern: "120 Multiple Choice Questions (2 Hours)", officialWebsite: "https://consortiumofnlus.ac.in", applicationFee: 4000, status: "Active" },
      { examName: "CUET UG 2026", slug: "cuet-ug-2026", shortName: "CUET", stream: "Arts", conductingBody: "National Testing Agency (NTA)", examLevel: "National", examMode: "Offline Exam", participatingCollegesCount: 115, description: "Common University Entrance Test for Central and State Universities across India.", eligibility: "Class 12th appeared or passed", syllabus: "Domain specific subjects and general aptitude testing", examPattern: "Computer Based Test / Hybrid mode multiple choice questions", officialWebsite: "https://cuetug.ntaonline.in", applicationFee: 750, status: "Active" }
    ]);

    // 7. Seed Blogs
    await Blog.insertMany([
      { title: "JEE Main 2026 Phase 2 Counselling & Seat Allotment Guidelines Released", slug: "jee-main-2026-phase-2-counselling-guidelines", category: "Admission Alerts", blogCategory: "Admission Alerts", author: "Dr. Amit Roy", authorName: "Dr. Amit Roy", publishDate: new Date("2026-06-28"), featuredImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80", coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80", blogDescription: "JoSAA has released key dates, document verification steps, and reporting rules for JEE Main 2026 B.Tech seat allotment.", content: "<p>The Joint Seat Allocation Authority (JoSAA) has officially announced the detailed schedule and guidelines for JEE Main 2026 Phase 2 Counselling.</p>", status: "Published" },
      { title: "AI & Machine Learning vs Core CS: Choosing the Right B.Tech Specialization in 2026", slug: "ai-ml-vs-core-cs-btech-specialization-2026", category: "Engineering", blogCategory: "Engineering", author: "Prof. Vikram Malhotra", authorName: "Prof. Vikram Malhotra", publishDate: new Date("2026-06-26"), featuredImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", blogDescription: "An in-depth comparative analysis evaluating placement records and industry demand.", content: "<p>With emerging technology reshaping global industries, engineering aspirants face a critical dilemma: Core CS vs AI/ML.</p>", status: "Published" }
    ]);

    // 8. Seed Live Alerts
    await Alert.insertMany([
      { title: "JEE Main 2026 Session 2 Slot Booking Link Activated", type: "Exam", body: "NTA has activated the candidate portal for shift allocation and admit card download for Session 2 exams.", link: "https://jeemain.nta.ac.in", deadline: new Date("2026-04-01"), status: "Active" },
      { title: "JoSAA Counselling 2026 Choice Locking Starts", type: "Admission", body: "Joint Seat Allocation Authority has opened online choice filling for IITs, NITs, and IIITs seat allotments.", link: "https://josaa.nic.in", deadline: new Date("2026-06-25"), status: "Active" },
      { title: "NEET UG 2026 Application Correction Window Open", type: "Exam", body: "Candidates can update category details, exam city preferences, and uploaded documents.", link: "https://neet.nta.nic.in", deadline: new Date("2026-04-15"), status: "Active" },
      { title: "GLA University Mathura B.Tech & MBA Direct Merit Admissions 2026 Open", type: "Admission", body: "Applications invited for NAAC A+ Grade university programs with up to 100% merit scholarship waiver.", link: "https://gla.ac.in", deadline: new Date("2026-07-31"), status: "Active" }
    ]);

    // 9. Seed Reviews
    const gla = insertedColleges.find(c => c.shortName === "GLA")?._id;
    const iitb = insertedColleges.find(c => c.shortName === "IITB")?._id;

    await Review.insertMany([
      { collegeId: gla, collegeName: "GLA University, Mathura", studentName: "Deepak Agrawal", email: "deepak.gla@gmail.com", batch: "2022-2026", course: "B.Tech CSE", ratings: { overall: 5, placement: 5, faculty: 5, campus: 5, value: 5 }, rating: 5, title: "Great placements & lush green campus in Mathura", body: "GLA University provides excellent placement opportunities with top companies visiting every season.", message: "Great placements & lush green campus in Mathura", pros: "Top placements, strong faculty, great labs", cons: "Strict discipline", isVerified: true, status: "Active" },
      { collegeId: iitb, collegeName: "IIT Bombay - Indian Institute of Technology [IITB]", studentName: "Aman Gupta", email: "aman.g@gmail.com", batch: "2022-2026", course: "B.Tech CSE", ratings: { overall: 5, placement: 5, faculty: 5, campus: 5, value: 5 }, rating: 5, title: "Unmatched coding environment & high tier placement opportunities", body: "The faculty and research culture at IIT Bombay is top notch.", message: "Unmatched coding environment", pros: "World class labs", cons: "Rigorous workload", isVerified: true, status: "Active" }
    ]);

    console.log("Database seeding completed successfully!");
    console.log(`Summary:
    - Streams: 10
    - Substreams: 35
    - Courses: 34
    - Colleges: ${insertedColleges.length}
    - Exams: 6`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();

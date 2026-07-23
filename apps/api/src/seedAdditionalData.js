const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const path     = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Question      = require("./models/Question");
const Testimonial   = require("./models/Testimonial");
const Scholarship   = require("./models/Scholarship");
const StudyMaterial = require("./models/StudyMaterial");
const Banner        = require("./models/Banner");
const { Alert }     = require("./models/Alert");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/college_dakhla";

async function appendData() {
  try {
    console.log("Connecting to MongoDB to add data without deleting existing records...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // 1. Add Questions (Q&A Community)
    const questionsCount = await Question.countDocuments({ isDeleted: false });
    if (questionsCount < 8) {
      console.log("Adding rich Q&A Community Questions...");
      await Question.insertMany([
        {
          title: "What is the minimum JEE Main rank required for B.Tech CSE at DTU Delhi?",
          body: "I am a Delhi region general candidate with a JEE Main rank of 6,200. Do I have a good chance of getting CSE or IT branch at DTU during JAC Delhi counselling rounds?",
          authorName: "Rohan Verma",
          authorEmail: "rohan.v@gmail.com",
          stream: "Engineering",
          tags: ["JEE Main", "DTU Delhi", "CSE", "Cutoff"],
          views: 342,
          upvotes: 28,
          status: "Open",
          answers: [
            {
              body: "Yes! For Delhi region candidates, the CSE cutoff at DTU usually closes around 6,500 - 7,000 rank in round 4/5. You have a very strong chance for Computer Engineering.",
              authorName: "Dr. Alok Nath (Counselling Expert)",
              authorEmail: "expert.alok@collegedakhla.com",
              isExpert: true,
              upvotes: 19
            }
          ]
        },
        {
          title: "Is GLA University Mathura good for B.Tech CSE placements?",
          body: "I received an offer letter from GLA University Mathura for CSE. How are the average packages, hostel facilities, and coding culture on campus?",
          authorName: "Aakash Agrawal",
          authorEmail: "aakash.a@gmail.com",
          stream: "Engineering",
          tags: ["GLA University", "Mathura", "Placements"],
          views: 215,
          upvotes: 16,
          status: "Open",
          answers: [
            {
              body: "GLA University has a solid placement record in Western UP with NAAC A+ accreditation. Top recruiters like TCS, Wipro, Capgemini, and Infosys visit every year. Average package for CSE is around ₹5.5 LPA - ₹6.5 LPA.",
              authorName: "Priya Sharma (GLA Alumna)",
              authorEmail: "priya.s@gmail.com",
              isExpert: false,
              upvotes: 12
            }
          ]
        },
        {
          title: "What is the expected CAT cutoff for IIM Lucknow MBA Finance?",
          body: "What general category CAT percentile and profile (10th/12th/Graduation marks) is needed to convert the call for IIM Lucknow PGP program?",
          authorName: "Neha Gupta",
          authorEmail: "neha.g@gmail.com",
          stream: "Management",
          tags: ["CAT 2026", "IIM Lucknow", "MBA Finance"],
          views: 480,
          upvotes: 35,
          status: "Open",
          answers: [
            {
              body: "For non-engineers, a CAT percentile of 98.5+ with 85%+ across 10th and 12th is competitive. For GEM (General Engineer Male), you usually need 99.3+ percentile for a shortlisting call.",
              authorName: "Prof. S. K. Roy (MBA Mentor)",
              authorEmail: "roy.mentor@collegedakhla.com",
              isExpert: true,
              upvotes: 24
            }
          ]
        },
        {
          title: "How to prepare for NEET UG 2026 Physics numerical questions?",
          body: "I am struggling with time management during NEET Physics numericals. What are the best standard reference books and mock test strategies?",
          authorName: "Siddharth Malhotra",
          authorEmail: "sid.m@gmail.com",
          stream: "Medical",
          tags: ["NEET UG", "Physics", "Preparation"],
          views: 520,
          upvotes: 42,
          status: "Open",
          answers: [
            {
              body: "First master NCERT solved examples and formulas. Practice HC Verma Concepts of Physics (Volume 1 & 2) and solve past 15 years NEET/AIPMT chapter-wise questions under timed conditions.",
              authorName: "Dr. Vandana Rao (Medical Faculty)",
              authorEmail: "dr.vandana@collegedakhla.com",
              isExpert: true,
              upvotes: 31
            }
          ]
        },
        {
          title: "Which state universities in UP offer direct B.Com (Hons) merit admission?",
          body: "Looking for top recognized central/state government universities in Uttar Pradesh offering B.Com Honours based on 12th commerce percentage.",
          authorName: "Simran Kaur",
          authorEmail: "simran.k@gmail.com",
          stream: "Commerce",
          tags: ["B.Com", "Uttar Pradesh", "Admissions"],
          views: 180,
          upvotes: 14,
          status: "Open",
          answers: [
            {
              body: "BHU Varanasi (via CUET UG), Lucknow University, DEI Agra, and Dayalbagh Educational Institute offer excellent B.Com Honours programs with very affordable fee structures.",
              authorName: "Admissions Team",
              authorEmail: "support@collegedakhla.com",
              isExpert: true,
              upvotes: 9
            }
          ]
        },
        {
          title: "What are the career prospects after 5-year Integrated BA LLB from NLUs?",
          body: "Can someone share insights on corporate law firm packages vs judicial services preparation after graduating from top NLUs like NLSIU or NLU Delhi?",
          authorName: "Karan Johar",
          authorEmail: "karan.j@gmail.com",
          stream: "Law",
          tags: ["CLAT", "BA LLB", "NLU Delhi", "Corporate Law"],
          views: 290,
          upvotes: 22,
          status: "Open",
          answers: [
            {
              body: "Top tier NLUs see tier-1 law firms like Shardul Amarchand Mangaldas, Khaitan & Co, and Cyril Amarchand Mangaldas offering starting packages between ₹16 LPA to ₹22 LPA. Many graduates also clear State Judicial Services or UPSC.",
              authorName: "Adv. Rajiv Saxena",
              authorEmail: "adv.rajiv@gmail.com",
              isExpert: true,
              upvotes: 18
            }
          ]
        }
      ]);
      console.log("Q&A Community Questions added successfully!");
    }

    // 2. Add Testimonials
    const testimonialsCount = await Testimonial.countDocuments({ isDeleted: false });
    if (testimonialsCount < 6) {
      console.log("Adding Testimonials...");
      await Testimonial.insertMany([
        {
          studentName: "Ananya Sharma",
          name: "Ananya Sharma",
          role: "B.Tech CSE Student @ IIT Delhi",
          college: "IIT Delhi",
          rating: 5,
          review: "College Dakhla made my admission journey smooth and guided me on exact cutoff rankings for JAC Delhi counselling.",
          description: "College Dakhla made my admission journey smooth and guided me on exact cutoff rankings for JAC Delhi counselling.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          status: "Active",
          isVerified: true,
          isFeatured: true
        },
        {
          studentName: "Vikramaditya Singh",
          name: "Vikramaditya Singh",
          role: "MBA Scholar @ IIM Lucknow",
          college: "IIM Lucknow",
          rating: 5,
          review: "The college comparison tool on College Dakhla helped me evaluate ROI, fees, and placements between IIM Lucknow and XLRI accurately.",
          description: "The college comparison tool on College Dakhla helped me evaluate ROI, fees, and placements between IIM Lucknow and XLRI accurately.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
          status: "Active",
          isVerified: true,
          isFeatured: true
        },
        {
          studentName: "Riya Agrawal",
          name: "Riya Agrawal",
          role: "B.Tech Student @ GLA University Mathura",
          college: "GLA University",
          rating: 5,
          review: "I got a 100% merit scholarship guidance through College Dakhla. The admission counselors explained everything clearly.",
          description: "I got a 100% merit scholarship guidance through College Dakhla. The admission counselors explained everything clearly.",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
          status: "Active",
          isVerified: true,
          isFeatured: true
        },
        {
          studentName: "Harsh Vardhan",
          name: "Harsh Vardhan",
          role: "MBBS Intern @ KGMU Lucknow",
          college: "KGMU Lucknow",
          rating: 5,
          review: "The NEET rank predictor and state medical cutoff analytics on this platform are incredibly accurate.",
          description: "The NEET rank predictor and state medical cutoff analytics on this platform are incredibly accurate.",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
          status: "Active",
          isVerified: true,
          isFeatured: true
        },
        {
          studentName: "Sneha Patel",
          name: "Sneha Patel",
          role: "BBA International Business @ Amity Noida",
          college: "Amity University",
          rating: 5,
          review: "Found genuine student reviews, fee breakdowns, and hostel details for private universities across North India.",
          description: "Found genuine student reviews, fee breakdowns, and hostel details for private universities across North India.",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
          status: "Active",
          isVerified: true,
          isFeatured: true
        }
      ]);
      console.log("Testimonials added successfully!");
    }

    // 3. Add Scholarships
    const scholarshipsCount = await Scholarship.countDocuments({ isDeleted: false });
    if (scholarshipsCount < 6) {
      console.log("Adding Scholarships...");
      await Scholarship.insertMany([
        {
          name: "UP Post Matric Scholarship Scheme 2026",
          provider: "Social Welfare Department, Govt. of Uttar Pradesh",
          type: "State",
          stream: ["Engineering", "Medical", "Management", "Commerce", "Arts"],
          amount: "Up to 100% Tuition Fee Reimbursement",
          description: "Financial assistance and fee reimbursement for SC/ST/OBC/General EWS students studying in recognized UP colleges.",
          eligibility: "Domicile of Uttar Pradesh, Annual Family Income less than ₹2.5 Lakhs (SC/ST) or ₹2.0 Lakhs (General/OBC).",
          howToApply: "Apply online at scholarship.up.gov.in with income certificate and admission fee receipt.",
          lastDate: new Date("2026-10-31"),
          officialLink: "https://scholarship.up.gov.in",
          isActive: true
        },
        {
          name: "GLA University Merit-Cum-Means Scholarship",
          provider: "GLA University, Mathura",
          type: "Merit",
          stream: ["Engineering", "Management", "Pharmacy"],
          amount: "₹25,000 to ₹1,00,000 / Year",
          description: "Merit scholarship based on 10+2 PCM percentage or JEE Main rank for engineering and management candidates.",
          eligibility: "Minimum 80% aggregate in 10+2 or JEE Main percentile above 85.",
          howToApply: "Submit 10+2 marksheet during online admission portal registration at GLA University.",
          lastDate: new Date("2026-08-15"),
          officialLink: "https://gla.ac.in/scholarships",
          isActive: true
        },
        {
          name: "Central Sector Scheme of Scholarships for College Students",
          provider: "Ministry of Education, Govt. of India",
          type: "Central",
          stream: ["Engineering", "Medical", "Commerce", "Science", "Arts"],
          amount: "₹12,000 / Year (Undergraduate)",
          description: "National scholarship to support meritorious students from low-income families pursuing higher education.",
          eligibility: "Top 20th percentile in Class 12th board exams with annual family income below ₹4.5 Lakhs.",
          howToApply: "Apply through National Scholarship Portal (NSP) at scholarships.gov.in.",
          lastDate: new Date("2026-11-30"),
          officialLink: "https://scholarships.gov.in",
          isActive: true
        },
        {
          name: "AICTE Pragati Scholarship for Female Engineering Students",
          provider: "AICTE (All India Council for Technical Education)",
          type: "Merit",
          stream: ["Engineering"],
          amount: "₹50,000 / Year",
          description: "Special government initiative to empower female students pursuing technical engineering degrees and diplomas.",
          eligibility: "Female candidates admitted to 1st year B.Tech/Diploma in AICTE approved institutions with family income under ₹8 Lakhs.",
          howToApply: "Submit application on National Scholarship Portal (NSP).",
          lastDate: new Date("2026-10-15"),
          officialLink: "https://aicte-india.org",
          isActive: true
        },
        {
          name: "Inspire Scholarship for Higher Education (SHE)",
          provider: "Department of Science & Technology (DST)",
          type: "Merit",
          stream: ["Science"],
          amount: "₹80,000 / Year",
          description: "Prestigious national scholarship for students pursuing B.Sc / M.Sc basic and natural sciences.",
          eligibility: "Top 1% in Class 12th board examinations or top ranks in JEE/NEET opting for Natural Sciences.",
          howToApply: "Register on online-inspire.gov.in portal.",
          lastDate: new Date("2026-12-15"),
          officialLink: "https://online-inspire.gov.in",
          isActive: true
        }
      ]);
      console.log("Scholarships added successfully!");
    }

    // 4. Add Study Materials
    const materialsCount = await StudyMaterial.countDocuments({ isDeleted: false });
    if (materialsCount < 6) {
      console.log("Adding Study Materials...");
      await StudyMaterial.insertMany([
        {
          title: "JEE Main Physics Chapter-Wise Formula Sheet & Revision Notes",
          subject: "Physics",
          examName: "JEE Main 2026",
          stream: "Engineering",
          type: "Notes",
          description: "Complete formula handbook covering Mechanics, Electromagnetics, Optics, and Modern Physics for quick revision.",
          fileUrl: "https://jeemain.nta.ac.in/images/syllabus-for-jee-main-2024.pdf",
          language: "English",
          downloads: 1420
        },
        {
          title: "JEE Main Mathematics 10-Year Solved Previous Year Question Papers",
          subject: "Mathematics",
          examName: "JEE Main 2026",
          stream: "Engineering",
          type: "Previous Year",
          description: "Detailed step-by-step solutions for JEE Main Math papers from 2015 to 2025.",
          fileUrl: "https://nta.ac.in/Download/ExamPaper/Paper_20230124151323.pdf",
          language: "English",
          downloads: 2310
        },
        {
          title: "NEET UG Biology NCERT High-Yield Mind Maps & Diagrams PDF",
          subject: "Biology",
          examName: "NEET UG 2026",
          stream: "Medical",
          type: "Notes",
          description: "Visual mind maps for Botany and Zoology covering Genetics, Ecology, and Human Physiology.",
          fileUrl: "https://neet.nta.nic.in/document/syllabus-for-neet-ug/",
          language: "English",
          downloads: 3890
        },
        {
          title: "CAT 2026 Quantitative Aptitude & Data Interpretation Practice Ebook",
          subject: "Quantitative Aptitude",
          examName: "CAT 2026",
          stream: "Management",
          type: "Ebook",
          description: "500+ solved practice problems on Algebra, Geometry, Arithmetic, and Logical Data Interpretation.",
          fileUrl: "https://iimcat.ac.in/per/g01/pub/756/ASM/WebPortal/1/index.html?756@@1@@1",
          language: "English",
          downloads: 1180
        },
        {
          title: "CUET UG General Test & Domain Subjects Sample Question Paper 2026",
          subject: "General Test",
          examName: "CUET UG 2026",
          stream: "Arts",
          type: "Sample Paper",
          description: "Mock test paper according to NTA latest exam pattern with answer key.",
          fileUrl: "https://cuetug.ntaonline.in/frontend/web/syllabus/Syllabus_General_Test.pdf",
          language: "English",
          downloads: 950
        },
        {
          title: "CLAT Legal Reasoning & Case Laws Summary Handbook",
          subject: "Legal Aptitude",
          examName: "CLAT 2026",
          stream: "Law",
          type: "Notes",
          description: "Summary of landmark Supreme Court judgments and legal principles for CLAT preparation.",
          fileUrl: "https://consortiumofnlus.ac.in/clat-2024/",
          language: "English",
          downloads: 740
        }
      ]);
      console.log("Study Materials added successfully!");
    }

    // 5. Add Banners
    const bannersCount = await Banner.countDocuments({ isDeleted: false });
    if (bannersCount < 2) {
      console.log("Adding Home Banners...");
      await Banner.insertMany([
        {
          title: "Explore 45+ Top Universities & Direct Admission Guidelines 2026",
          subtitle: "Filter colleges by cutoffs, placement stats, and state rankings.",
          imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
          linkUrl: "/colleges",
          order: 1,
          status: "Active"
        },
        {
          title: "JEE Main & NEET UG 2026 Instant Rank Predictor & Cutoff Analytics",
          subtitle: "Calculate your chances in top government and private institutes.",
          imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
          linkUrl: "/predictor",
          order: 2,
          status: "Active"
        }
      ]);
      console.log("Home Banners added successfully!");
    }

    console.log("All additional modules populated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error appending additional data:", err);
    process.exit(1);
  }
}

appendData();

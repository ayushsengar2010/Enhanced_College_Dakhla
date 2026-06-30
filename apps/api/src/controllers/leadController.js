const Lead          = require("../models/Lead");
const College       = require("../models/College");
const nodemailer    = require("nodemailer");
const { parsePagination } = require("../utils/pagination");
const { sanitizeString, isValidEmail, isValidPhone, safeRegex } = require("../utils/validation");
const logger = require("../utils/logger");

/**
 * 📩 Create New Lead & Generate Top 5 Matching College Recommendations
 */
const createLead = async (req, res, next) => {
  try {
    const body   = req.body;
    const name   = sanitizeString(body.name || "", 100);
    const city   = sanitizeString(body.city || "", 100);
    const state  = sanitizeString(body.state || "", 100);
    const course = sanitizeString(body.course || "", 200);
    const source = sanitizeString(body.source || "home_recommendation_portal", 50);
    const email  = sanitizeString(body.email || "", 100);
    const phone  = sanitizeString(body.phone || "", 15);

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    // Clean phone digits BEFORE validation to handle formatted numbers (e.g., +91 9876543210)
    const digitsOnly = phone.replace(/\D/g, "");
    // Strip leading country codes (91 for India, 1 for US, etc.) if present
    const cleanedPhone = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
    if (!isValidPhone(cleanedPhone)) {
      return res.status(400).json({ message: "Invalid phone number. Must be 10 digits starting with 6-9." });
    }

    // 🔍 Multi-Tiered Location & Course Matching Algorithm
    let matchingColleges = [];

    if (state) {
      const stateRegex = safeRegex(state);

      if (city) {
        const cityColleges = await College.find({
          city: safeRegex(city),
          state: stateRegex,
          status: "Active",
        })
          .sort({ ranking: 1, rating: -1 })
          .limit(5);
        matchingColleges = [...cityColleges];
      }

      if (matchingColleges.length < 5) {
        const existingIds    = matchingColleges.map((c) => c._id);
        const remainingSlots = 5 - matchingColleges.length;
        const stateColleges  = await College.find({
          _id: { $nin: existingIds },
          state: stateRegex,
          status: "Active",
        })
          .sort({ ranking: 1, rating: -1 })
          .limit(remainingSlots);
        matchingColleges = [...matchingColleges, ...stateColleges];
      }
    } else {
      if (city) {
        matchingColleges = await College.find({
          city: new RegExp(city, "i"),
          status: "Active",
        })
          .sort({ ranking: 1, rating: -1 })
          .limit(5);
      }

      if (matchingColleges.length < 5) {
        const existingIds    = matchingColleges.map((c) => c._id);
        const remainingSlots = 5 - matchingColleges.length;
        const nationalColleges = await College.find({
          _id: { $nin: existingIds },
          status: "Active",
        })
          .sort({ ranking: 1, rating: -1 })
          .limit(remainingSlots);
        matchingColleges = [...matchingColleges, ...nationalColleges];
      }
    }

    const assignedCollegeIds = matchingColleges.map((c) => c._id);

    const leadPayload = {
      name,
      email,
      phone: cleanedPhone,
      state: state || undefined,
      city: city || undefined,
      course: course || undefined,
      message:          sanitizeString(body.message || "", 1000),
      source,
      collegeId:        body.collegeId || null,
      assignedColleges: assignedCollegeIds,
      status:           "Pending",
      remark:           sanitizeString(body.remark || "", 500),
    };

    const newLead = await Lead.create(leadPayload);

    const populatedLead = await Lead.findById(newLead._id).populate(
      "assignedColleges",
      "collegeName shortName slug city state category ranking fees highestPackage rating userReviews bestFor"
    );

    res.status(201).json({
      message: "Enquiry submitted successfully!",
      lead: populatedLead,
      recommendedColleges: populatedLead.assignedColleges,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 📋 List All Leads with Search, Filtering & Source Filter
 */
const listLeads = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.status)  filter.status = req.query.status;
    if (req.query.source)  filter.source = req.query.source;
    if (req.query.city)    filter.city   = new RegExp(req.query.city,  "i");
    if (req.query.state)   filter.state  = new RegExp(req.query.state, "i");

    if (req.query.search) {
      const s = req.query.search;
      filter.$or = [
        { name:   new RegExp(s, "i") },
        { email:  new RegExp(s, "i") },
        { phone:  new RegExp(s, "i") },
        { course: new RegExp(s, "i") },
      ];
    }

    const [items, total] = await Promise.all([
      Lead.find(filter)
        .populate("assignedColleges", "collegeName city state ranking")
        .populate("collegeId", "collegeName shortName slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 👁️ Get Single Lead Details
 */
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedColleges")
      .populate("collegeId", "collegeName shortName slug");
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

/**
 * ✏️ Update Lead Status & Remarks (Admin Management)
 */
const updateLead = async (req, res, next) => {
  try {
    const { status, remark, assignedColleges } = req.body;
    const updateData = {};
    if (status)             updateData.status           = status;
    if (remark !== undefined) updateData.remark         = remark;
    if (assignedColleges)   updateData.assignedColleges = assignedColleges;

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("assignedColleges");

    if (!updatedLead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead updated successfully", lead: updatedLead });
  } catch (err) {
    next(err);
  }
};

/**
 * 🗑️ Delete Lead Record
 */
const deleteLead = async (req, res, next) => {
  try {
    const deleted = await Lead.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead record deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * 📧 Send Email Notification to Lead via Nodemailer
 */
const sendLeadEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(503).json({
        message: "Email service not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in environment variables.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from:    '"College Dakhla Admissions" <admissions@collegedakhla.com>',
      to:      lead.email,
      subject: subject || "College Admission Update - College Dakhla",
      text:    message || `Hello ${lead.name},\n\nThank you for reaching out to College Dakhla. Our counselor will get in touch with you shortly.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: `Email successfully triggered to ${lead.email}` });
  } catch (err) {
    console.error("Failed to send email to lead:", err.message);
    // Return a proper error instead of lying to the user
    next(new Error(`Failed to send email: ${err.message}`));
  }
};

/**
 * 📊 Export Leads to CSV File
 */
const exportLeadsCSV = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.source) filter.source = req.query.source;

    const leads = await Lead.find(filter).populate("assignedColleges", "collegeName");

    const csvHeaders = "ID,Name,Email,Phone,State,City,Course,Source,Status,Remark,Created At\n";
    const csvRows = leads.map((l) => {
      const cleanName   = `"${(l.name   || "").replace(/"/g, '""')}"`;
      const cleanCourse = `"${(l.course || "").replace(/"/g, '""')}"`;
      const cleanRemark = `"${(l.remark || "").replace(/"/g, '""')}"`;
      return `${l._id},${cleanName},${l.email},${l.phone},${l.state || ""},${l.city || ""},${cleanCourse},${l.source || ""},${l.status},${cleanRemark},${l.createdAt}`;
    }).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads_report.csv");
    res.status(200).send(csvHeaders + csvRows);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createLead,
  listLeads,
  getLeadById,
  updateLead,
  deleteLead,
  sendLeadEmail,
  exportLeadsCSV,
};

const College = require("../models/College");
const Course = require("../models/Course");
const { logAudit } = require("../utils/audit");
const { parsePagination } = require("../utils/pagination");
const slugify = require("../utils/slugify");

const numericFields = ["establishedYear", "ranking", "rating", "fees"];
const dateFields = ["applicationStartDate", "applicationEndDate"];

const sanitizeCollegePayload = (payload) => {
  const sanitized = { ...payload };
  for (const field of numericFields) {
    if (sanitized[field] === "" || sanitized[field] === null) delete sanitized[field];
  }
  for (const field of dateFields) {
    if (sanitized[field] === "") delete sanitized[field];
  }
  if (sanitized.slug === "") delete sanitized.slug;
  return sanitized;
};

const buildSort = (sortKey) => {
  switch (sortKey) {
    case "rating":  return { rating: -1 };
    case "fees":    return { fees: 1 };
    case "ranking": return { ranking: 1 };
    default:        return { createdAt: -1 };
  }
};

/* ─────────────────────────────────────────────
   LIST  GET /api/colleges
───────────────────────────────────────────── */
const listColleges = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };

    if (req.user) {
      if (req.query.status && req.query.status !== "all") {
        filter.status = req.query.status;
      }
    } else {
      filter.status = "Active";
    }

    if (req.query.state || req.query.city || req.query.location) {
      const locOrs = [];
      if (req.query.state) {
        let st = req.query.state.trim();
        if (st.toLowerCase() === "up") st = "Uttar Pradesh";
        locOrs.push({ state: new RegExp(st, "i") });
        locOrs.push({ location: new RegExp(st, "i") });
      }
      if (req.query.city) {
        let ct = req.query.city.trim();
        if (ct.toLowerCase() === "up" || ct.toLowerCase() === "uttar pradesh") {
          locOrs.push({ state: new RegExp("Uttar Pradesh", "i") });
        } else {
          locOrs.push({ city: new RegExp(ct, "i") });
          locOrs.push({ state: new RegExp(ct, "i") });
        }
        locOrs.push({ location: new RegExp(ct, "i") });
      }
      if (req.query.location) {
        let loc = req.query.location.trim();
        locOrs.push({ city: new RegExp(loc, "i") });
        locOrs.push({ state: new RegExp(loc, "i") });
        locOrs.push({ location: new RegExp(loc, "i") });
      }
      if (locOrs.length > 0) {
        filter.$and = filter.$and || [];
        filter.$and.push({ $or: locOrs });
      }
    }

    if (req.query.collegeType) filter.collegeType = new RegExp(req.query.collegeType, "i");

    if (req.query.maxFees || req.query.minFees) {
      filter.fees = {};
      if (req.query.minFees) filter.fees.$gte = Number(req.query.minFees);
      if (req.query.maxFees) filter.fees.$lte = Number(req.query.maxFees);
    }

    if (req.query.search) {
      const rawSearch = req.query.search.trim();
      let cleanQ = rawSearch.replace(/admission\s*202\d/i, "").replace(/b\.tech/i, "Engineering").trim();
      if (!cleanQ) cleanQ = rawSearch;

      const regex = new RegExp(cleanQ, "i");
      
      const matchingCourseIds = await Course.find({
        $or: [{ courseName: regex }, { stream: regex }, { subStream: regex }]
      }).select("_id").lean();

      filter.$or = [
        { collegeName: regex },
        { shortName:   regex },
        { city:        regex },
        { state:       regex },
        { courses:     { $in: matchingCourseIds.map(c => c._id) } }
      ];
    }

    if (req.query.course || req.query.stream) {
      const courseFilter = { isDeleted: false };
      const courseOrs = [];
      if (req.query.course) {
        const rawC = req.query.course.trim();
        let terms = [rawC];
        if (rawC.includes("/")) {
          terms = rawC.split("/").map(t => t.trim()).filter(Boolean);
        }
        terms.forEach(term => {
          courseOrs.push({ courseName: new RegExp(term, "i") });
          courseOrs.push({ stream: new RegExp(term, "i") });
          courseOrs.push({ subStream: new RegExp(term, "i") });
        });
      }
      if (req.query.stream) {
        courseOrs.push({ stream: new RegExp(req.query.stream, "i") });
      }
      if (courseOrs.length > 0) {
        courseFilter.$or = courseOrs;
      }
      
      const courseIds = await Course.find(courseFilter).select("_id").lean();
      filter.courses = { $in: courseIds.map((c) => c._id) };
    }

    const sort = buildSort(req.query.sort);

    const [items, total] = await Promise.all([
      College.find(filter).populate("courses").sort(sort).skip(skip).limit(limit).lean(),
      College.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const getCollegeBySlug = async (req, res, next) => {
  try {
    const college = await College.findOne({
      slug: req.params.slug,
      isDeleted: false,
    }).populate("courses");

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    res.json(college);
  } catch (err) {
    next(err);
  }
};

const getCollegeById = async (req, res, next) => {
  try {
    const college = await College.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("courses");

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    res.json(college);
  } catch (err) {
    next(err);
  }
};

const createCollege = async (req, res, next) => {
  try {
    const payload = sanitizeCollegePayload(req.body);
    if (!payload.slug && payload.collegeName) {
      payload.slug = slugify(payload.collegeName);
    }

    const college = await College.create(payload);
    await logAudit({ action: "CREATE", entityType: "College", entityId: college._id, createdBy: req.user?.email || "system" });
    res.status(201).json(college);
  } catch (err) {
    next(err);
  }
};

const updateCollege = async (req, res, next) => {
  try {
    const college = await College.findOne({ _id: req.params.id, isDeleted: false });
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const oldData = college.toObject();
    const payload = sanitizeCollegePayload(req.body);

    if (payload.collegeName && !payload.slug) {
      payload.slug = slugify(payload.collegeName);
    }

    Object.assign(college, payload);
    await college.save();

    await logAudit({ action: "UPDATE", entityType: "College", entityId: college._id, message: "Updated college details", createdBy: req.user?.email || "system" });
    res.json(college);
  } catch (err) {
    next(err);
  }
};

const deleteCollege = async (req, res, next) => {
  try {
    const college = await College.findOne({ _id: req.params.id, isDeleted: false });
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const oldData = college.toObject();
    college.isDeleted = true;
    await college.save();

    await logAudit({ action: "DELETE", entityType: "College", entityId: college._id, message: "Deleted college", createdBy: req.user?.email || "system" });
    res.json({ message: "College deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listColleges,
  getCollegeBySlug,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
};

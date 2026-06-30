const Banner = require("../models/Banner");

const { emitDashboardUpdate } = require("../socket");

const listBanners = async (req, res, next) => {
  try {
    // Admin sees all; public sees only active
    const filter = {};
    if (!req.admin) {
      filter.isActive = true;
    }

    const { search, page = 1, limit = 20 } = req.query;
    const query = { ...filter };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const total = await Banner.countDocuments(query);
    const banners = await Banner.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({
      items: banners,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const createBanner = async (req, res, next) => {
  try {
    const { title, imageUrl, link, description, isActive, order } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ message: "Title and image URL are required" });
    }
    const banner = await Banner.create({ title, imageUrl, link, description, isActive, order });
    emitDashboardUpdate({ type: "banner_created", bannerId: banner._id });
    res.status(201).json(banner);
  } catch (err) {
    next(err);
  }
};

const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    emitDashboardUpdate({ type: "banner_updated", bannerId: banner._id });
    res.json(banner);
  } catch (err) {
    next(err);
  }
};

const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    emitDashboardUpdate({ type: "banner_deleted", bannerId: id });
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { listBanners, createBanner, updateBanner, deleteBanner };

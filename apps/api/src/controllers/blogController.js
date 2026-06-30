const Blog = require("../models/Blog");
const { parsePagination } = require("../utils/pagination");
const { safeRegex, sanitizeString } = require("../utils/validation");

/**
 * List blogs with filtering, search, pagination
 * GET /api/blogs
 */
const listBlogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };

    // Public users only see published/active posts
    if (!req.user) {
      filter.status = { $in: ["Published", "Active"] };
    } else if (req.query.status) {
      filter.status = req.query.status;
    }

    // Category filter
    if (req.query.category && req.query.category !== "All") {
      const cat = safeRegex(req.query.category);
      filter.$or = [
        { category: cat },
        { blogCategory: cat },
      ];
    }

    // Tag filter
    if (req.query.tag) {
      filter.tags = safeRegex(req.query.tag);
    }

    // Search by title/content
    if (req.query.search) {
      const search = sanitizeString(req.query.search, 100);
      const searchRegex = safeRegex(search);
      filter.$or = filter.$or || [];
      filter.$or.push(
        { title: searchRegex },
        { blogDescription: searchRegex },
        { tags: searchRegex },
      );
    }

    const [items, total] = await Promise.all([
      Blog.find(filter)
        .sort({ isFeatured: -1, featuredOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

/**
 * Get featured posts (for homepage/featured section)
 * GET /api/blogs/featured
 */
const getFeaturedPosts = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "6", 10), 20);
    const posts = await Blog.find({
      isFeatured: true,
      isDeleted: false,
      status: { $in: ["Published", "Active"] },
    })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(posts);
  } catch (err) { next(err); }
};

/**
 * Get unique list of blog categories
 * GET /api/blogs/categories
 */
const getBlogCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct("category", {
      isDeleted: false,
      status: { $in: ["Published", "Active"] },
    });
    res.json(categories.sort());
  } catch (err) { next(err); }
};

/**
 * Get single blog by slug
 * GET /api/blogs/slug/:slug
 */
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isDeleted: false });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.status !== "Published" && !req.user) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) { next(err); }
};

/**
 * Get single blog by ID
 * GET /api/blogs/:id
 */
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, isDeleted: false });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) { next(err); }
};

/**
 * Create a new blog post
 * POST /api/blogs
 */
const createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) { next(err); }
};

/**
 * Update an existing blog post
 * PUT /api/blogs/:id
 */
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true },
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) { next(err); }
};

/**
 * Soft-delete a blog post
 * DELETE /api/blogs/:id
 */
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

module.exports = {
  listBlogs, getFeaturedPosts, getBlogCategories,
  getBlogBySlug, getBlogById,
  createBlog, updateBlog, deleteBlog,
};

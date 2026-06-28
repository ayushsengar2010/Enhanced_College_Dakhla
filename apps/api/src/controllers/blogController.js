const Blog = require("../models/Blog");
const { parsePagination } = require("../utils/pagination");

const listBlogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (!req.user) filter.status = "Published";
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.title = new RegExp(req.query.search, "i");
    const [items, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select("-content"),
      Blog.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isDeleted: false });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.status !== "Published" && !req.user) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) { next(err); }
};

const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, isDeleted: false });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) { next(err); }
};

const createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) { next(err); }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) { next(err); }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

module.exports = { listBlogs, getBlogBySlug, getBlogById, createBlog, updateBlog, deleteBlog };

const express = require("express");
const {
  listBlogs, getFeaturedPosts, getBlogCategories,
  getBlogBySlug, getBlogById,
  createBlog, updateBlog, deleteBlog,
} = require("../controllers/blogController");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/",             optionalAuth, listBlogs);
router.get("/featured",     optionalAuth, getFeaturedPosts);
router.get("/categories",   optionalAuth, getBlogCategories);
router.get("/slug/:slug",   optionalAuth, getBlogBySlug);
router.get("/:id",          requireAuth,  getBlogById);
router.post("/",            requireAuth,  createBlog);
router.put("/:id",          requireAuth,  updateBlog);
router.delete("/:id",       requireAuth,  deleteBlog);

module.exports = router;

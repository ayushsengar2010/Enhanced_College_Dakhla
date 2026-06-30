const rateLimit = require("express-rate-limit");

/**
 * Strict rate limiter for auth endpoints (login)
 * 10 attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

/**
 * Moderate rate limiter for general API endpoints (leads, etc.)
 * 60 requests per minute per IP
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests. Please slow down.",
  },
});

/**
 * Strict rate limiter for lead creation to prevent spam
 * 10 submissions per 15 minutes per IP
 */
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many submissions. Please try again later.",
  },
});

module.exports = { authLimiter, apiLimiter, leadLimiter };

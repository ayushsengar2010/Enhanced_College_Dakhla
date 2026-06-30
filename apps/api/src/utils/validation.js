/**
 * Centralized input validation & sanitization utilities
 * Prevents XSS, regex injection, and malformed data
 */

/**
 * Escape special regex characters to prevent regex injection
 */
const escapeRegex = (str) => {
  if (typeof str !== "string") return str;
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Sanitize a string: trim whitespace, strip HTML tags, limit length
 */
const sanitizeString = (str, maxLength = 500) => {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .substring(0, maxLength);
};

/**
 * Sanitize rich text (allows basic HTML for editors but strips dangerous tags)
 */
const sanitizeRichText = (html, maxLength = 50000) => {
  if (typeof html !== "string") return "";
  // Allow safe tags only
  return html
    .substring(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
    .replace(/on\w+="[^"]*"/gi, "") // Remove event handlers
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "blocked:");
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

/**
 * Validate Indian phone number (10 digits starting with 6-9)
 */
const isValidPhone = (phone) => {
  if (typeof phone !== "string") return false;
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""));
};

/**
 * Validate MongoDB ObjectId format
 */
const isValidObjectId = (id) => {
  if (typeof id !== "string") return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Create a safe regex for search/filter queries (prevents injection)
 */
const safeRegex = (str, flags = "i") => {
  try {
    return new RegExp(escapeRegex(str.trim()), flags);
  } catch {
    return new RegExp("");
  }
};

/**
 * Parse and validate pagination params
 */
const parsePagination = (query = {}) => {
  let page = parseInt(query.page || "1", 10);
  let limit = parseInt(query.limit || "10", 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 100) limit = 100;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Validate enum values against allowed list
 */
const isValidEnum = (value, allowedValues) => {
  return allowedValues.includes(value);
};

module.exports = {
  escapeRegex,
  sanitizeString,
  sanitizeRichText,
  isValidEmail,
  isValidPhone,
  isValidObjectId,
  safeRegex,
  parsePagination,
  isValidEnum,
};

/**
 * Cache control middleware for API responses
 * Improves performance by setting appropriate Cache-Control headers
 */

/**
 * Disable caching for dynamic data (leads, auth, analytics)
 */
const noCache = (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
};

/**
 * Allow caching for public data (colleges, courses, exams, blogs)
 * Cache for 5 minutes by default
 */
const publicCache = (maxAge = 300) => {
  return (req, res, next) => {
    res.set("Cache-Control", `public, max-age=${maxAge}, s-maxage=${maxAge}`);
    res.set("Vary", "Accept-Encoding");
    next();
  };
};

/**
 * Allow short caching (1 minute) for semi-dynamic data
 */
const shortCache = (maxAge = 60) => {
  return (req, res, next) => {
    res.set("Cache-Control", `private, max-age=${maxAge}`);
    next();
  };
};

module.exports = { noCache, publicCache, shortCache };

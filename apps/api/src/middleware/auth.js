const jwt = require("jsonwebtoken");

const buildUser = (payload) => ({
  email: payload.email,
  role: payload.role
});

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authentication required. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication required. Invalid token format." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify the user has admin role
    if (!payload.role || payload.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    
    req.user = buildUser(payload);
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
    return res.status(401).json({ message: "Invalid or malformed token." });
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      req.user = null;
      return next();
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = buildUser(payload);
  } catch (err) {
    req.user = null;
  }

  return next();
};

module.exports = { requireAuth, optionalAuth };

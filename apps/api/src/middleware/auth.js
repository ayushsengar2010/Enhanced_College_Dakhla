const jwt = require("jsonwebtoken");

const buildUser = (payload) => ({
  email: payload.email,
  role: payload.role
});

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = buildUser(payload);
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = buildUser(payload);
  } catch (err) {
    req.user = null;
  }

  return next();
};

module.exports = { requireAuth, optionalAuth };

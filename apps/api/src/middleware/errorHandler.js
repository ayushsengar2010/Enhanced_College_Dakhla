const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "value";
    return res.status(409).json({ message: `A college with this ${field} already exists.` });
  }

  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };

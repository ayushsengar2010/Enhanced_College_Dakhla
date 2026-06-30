const { cloudinary, isCloudinaryReady } = require("../config/cloudinary");
const logger = require("../utils/logger");

const ALLOWED_MIMETYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // Validate file type on backend as well (defense in depth)
    if (!ALLOWED_MIMETYPES.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: `Unsupported file type "${req.file.mimetype}". Allowed: ${ALLOWED_MIMETYPES.join(", ")}`,
      });
    }

    // Validate file size on backend
    if (req.file.size > MAX_FILE_SIZE) {
      // Remove the uploaded file to save disk space
      try {
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      } catch {}
      return res.status(400).json({
        message: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }

    if (process.env.USE_CLOUDINARY === "true" && isCloudinaryReady) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "college-dakhla",
      });
      logger.info("File uploaded to Cloudinary", { publicId: result.public_id, url: result.secure_url });
      return res.json({ url: result.secure_url, publicId: result.public_id });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    logger.info("File saved locally", { filename: req.file.filename, url: fileUrl });
    return res.json({ url: fileUrl, filename: req.file.filename });
  } catch (err) {
    return next(err);
  }
};

module.exports = { uploadFile };

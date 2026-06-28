const { cloudinary, isCloudinaryReady } = require("../config/cloudinary");

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    if (process.env.USE_CLOUDINARY === "true" && isCloudinaryReady) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "college-dakhla"
      });
      return res.json({ url: result.secure_url, publicId: result.public_id });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    return res.json({ url: fileUrl, filename: req.file.filename });
  } catch (err) {
    return next(err);
  }
};

module.exports = { uploadFile };

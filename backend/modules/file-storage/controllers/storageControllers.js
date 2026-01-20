// modules/file-storage/controllers/storageControllers.js
const storageService = require("../services/storageService");

async function upload(req, res, next) {
  try {
    const folder = req.body.folder || "docs";

    const fileRef = await storageService.uploadFile({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      contentType: req.file.mimetype,
      folder,
    });

    return res.status(201).json({ success: true, fileRef });
  } catch (err) {
    next(err);
  }
}

async function signedUrl(req, res, next) {
  try {
    const path = req.query.path;
    const expiresIn = req.query.expiresIn ? Number(req.query.expiresIn) : undefined;

    const result = await storageService.getSignedUrl({ path, expiresIn });
    return res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const path = req.query.path || req.body?.path;
    await storageService.deleteFile({ path });
    return res.json({ success: true, message: "deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, signedUrl, remove };

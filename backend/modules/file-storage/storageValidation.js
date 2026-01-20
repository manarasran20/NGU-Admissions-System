// modules/file-storage/services/storageValidation.js

function requireFile(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "file is required (field name must be: file)",
    });
  }
  next();
}

function requirePath(req, res, next) {
  const p = req.query.path || req.body?.path;
  if (!p) {
    return res.status(400).json({
      success: false,
      message: "path is required (?path=... or { path: ... })",
    });
  }
  next();
}

module.exports = { requireFile, requirePath };
//storge/documents
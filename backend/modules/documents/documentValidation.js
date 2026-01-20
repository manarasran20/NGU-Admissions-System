// modules/documents/services/documentValidation.js
function validateCreate(req, res, next) {
  const { userId, docType, fileRef } = req.body;

  if (!userId || !docType) {
    return res.status(400).json({
      success: false,
      message: "userId and docType are required",
    });
  }

  if (!fileRef?.fileId || !fileRef?.path) {
    return res.status(400).json({
      success: false,
      message: "fileRef is required (must include fileId and path)",
    });
  }

  next();
}

module.exports = { validateCreate };

// modules/documents/controllers/documentController.js
const documentService = require("../services/documentService");

async function create(req, res, next) {
  try {
    const doc = await documentService.createDocumentMetadata(req.body);
    return res.status(201).json({ success: true, document: doc });
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    const userId = req.query.userId || req.body?.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const docs = await documentService.listUserDocuments(userId);
    return res.json({ success: true, documents: docs });
  } catch (err) {
    next(err);
  }
}

async function verify(req, res, next) {
  try {
    const { id } = req.params;
    const { status, verifiedBy, rejectionReason } = req.body;

    if (!["approved", "rejected", "pending_review"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be one of: pending_review, approved, rejected",
      });
    }

    const updated = await documentService.setVerificationStatus(id, {
      status,
      verifiedBy,
      rejectionReason,
    });

    return res.json({ success: true, document: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, listMine, verify };

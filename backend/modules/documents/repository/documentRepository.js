// modules/documents/repository/documentRepository.js
const Document = require("../models/Document");

async function create(payload) {
  return Document.create(payload);
}

async function findByUser(userId) {
  return Document.find({ userId }).sort({ createdAt: -1 });
}

async function updateVerification(documentId, { status, verifiedBy, rejectionReason }) {
  const update = {
    status,
    "verification.verifiedBy": verifiedBy || null,
    "verification.verifiedAt": new Date(),
    "verification.rejectionReason": rejectionReason || null,
  };

  return Document.findByIdAndUpdate(documentId, update, { new: true });
}

module.exports = { create, findByUser, updateVerification };

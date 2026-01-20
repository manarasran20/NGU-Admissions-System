// modules/documents/services/documentService.js
const repo = require("../repository/documentRepository");

class DocumentService {
  async createDocumentMetadata({ userId, docType, title, isRequired, requiredFor, fileRef }) {
    if (!fileRef?.fileId || !fileRef?.path) {
      throw new Error("fileRef is required (from file-storage module)");
    }

    return repo.create({
      userId,
      docType,
      title,
      isRequired: !!isRequired,
      requiredFor,
      fileRef,
    });
  }

  async listUserDocuments(userId) {
    return repo.findByUser(userId);
  }

  async setVerificationStatus(documentId, payload) {
    return repo.updateVerification(documentId, payload);
  }
}

module.exports = new DocumentService();

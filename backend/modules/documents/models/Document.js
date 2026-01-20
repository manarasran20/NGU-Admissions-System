// modules/documents/models/Document.js
const mongoose = require("mongoose");

const FileRefSchema = new mongoose.Schema(
  {
    fileId: { type: String, required: true },
    provider: { type: String, required: true }, // local | supabase
    bucket: { type: String, required: true },
    path: { type: String, required: true },
  },
  { _id: false }
);

const DocumentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },

    docType: { type: String, required: true }, // e.g. passport, national_id, transcript
    title: { type: String, default: "" },

    isRequired: { type: Boolean, default: false },
    requiredFor: { type: String, default: "" }, // e.g. admissions/appId/program

    status: {
      type: String,
      enum: ["pending_review", "approved", "rejected"],
      default: "pending_review",
    },

    verification: {
      verifiedBy: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
      rejectionReason: { type: String, default: null },
    },

    fileRef: { type: FileRefSchema, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);

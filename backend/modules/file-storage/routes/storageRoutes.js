// modules/file-storage/routes/storageRoutes.js
const express = require("express");
const multer = require("multer");

const storageController = require("../controllers/storageControllers");
const { requireFile, requirePath } = require("../services/storageValidation");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/storage/upload
router.post("/upload", upload.single("file"), requireFile, storageController.upload);

// GET /api/storage/signed-url?path=...
router.get("/signed-url", requirePath, storageController.signedUrl);

// DELETE /api/storage/delete?path=...
router.delete("/delete", requirePath, storageController.remove);

module.exports = router;
v
// modules/file-storage/providers/localProvider.js
const fs = require("fs");
const path = require("path");

class LocalProvider {
  constructor(cfg) {
    this.provider = "local";
    this.bucket = "local";
    this.uploadPath = cfg.uploadPath;
    this.publicBaseUrl = cfg.publicBaseUrl;
  }

  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  }

  async upload({ path: filePath, buffer }) {
    const fullPath = path.join(this.uploadPath, filePath);
    this.ensureDir(path.dirname(fullPath));
    await fs.promises.writeFile(fullPath, buffer);

    return {
      provider: this.provider,
      bucket: this.bucket,
      path: filePath,
    };
  }

  async createSignedUrl({ path: filePath, expiresIn = 60 * 10 }) {
    // Local: fake "signed" URL (simple direct URL). For dev.
    return {
      url: `${this.publicBaseUrl}/uploads/${encodeURIComponent(filePath)}`,
      expiresIn,
      provider: this.provider,
    };
  }

  async remove({ path: filePath }) {
    const fullPath = path.join(this.uploadPath, filePath);
    try {
      await fs.promises.unlink(fullPath);
    } catch (e) {
      // ignore if not exists
    }
    return { deleted: true, provider: this.provider };
  }
}

module.exports = LocalProvider;

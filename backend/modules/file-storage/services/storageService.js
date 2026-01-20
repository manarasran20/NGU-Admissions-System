// modules/file-storage/services/storageService.js
const crypto = require("crypto");
const storageConfig = require("../config/storageConfig");
const SupabaseProvider = require("../providers/supabaseProvider");
const LocalProvider = require("../providers/localProvider");

function buildProvider() {
  if ((storageConfig.provider || "").toLowerCase() === "supabase") {
    return new SupabaseProvider(storageConfig.supabase);
  }
  return new LocalProvider(storageConfig.local);
}

class StorageService {
  constructor() {
    this.provider = buildProvider();
  }

  async uploadFile({ buffer, originalName, contentType, folder = "docs" }) {
    const fileId = crypto.randomUUID();
    const safeName = String(originalName || "file").replace(/[^\w.\-]+/g, "_");
    const path = `${folder}/${fileId}_${safeName}`;

    const ref = await this.provider.upload({ path, buffer, contentType });

    return {
      fileId,
      provider: ref.provider,
      bucket: ref.bucket,
      path: ref.path,
    };
  }

  async getSignedUrl({ path, expiresIn }) {
    return this.provider.createSignedUrl({ path, expiresIn });
  }

  async deleteFile({ path }) {
    return this.provider.remove({ path });
  }
}

module.exports = new StorageService();

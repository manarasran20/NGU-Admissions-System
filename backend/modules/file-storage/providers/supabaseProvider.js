// modules/file-storage/providers/supabaseProvider.js
const { createClient } = require("@supabase/supabase-js");

class SupabaseProvider {
  constructor(cfg) {
    if (!cfg?.url || !cfg?.serviceKey) {
      throw new Error("Supabase provider requires SUPABASE_URL and SUPABASE_SERVICE_KEY");
    }
    this.provider = "supabase";
    this.bucket = cfg.bucket || "documents";
    this.client = createClient(cfg.url, cfg.serviceKey);
  }

  async upload({ path, buffer, contentType }) {
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(path, buffer, {
        upsert: true,
        contentType: contentType || "application/octet-stream",
      });

    if (error) throw error;

    return {
      provider: this.provider,
      bucket: this.bucket,
      path,
    };
  }

  async createSignedUrl({ path, expiresIn = 60 * 10 }) {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;

    return {
      url: data.signedUrl,
      expiresIn,
      provider: this.provider,
    };
  }

  async remove({ path }) {
    const { error } = await this.client.storage.from(this.bucket).remove([path]);
    if (error) throw error;
    return { deleted: true, provider: this.provider };
  }
}

module.exports = SupabaseProvider;

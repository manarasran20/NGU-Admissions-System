// modules/file-storage/config/storageConfig.js
require("dotenv").config();

module.exports = {
  provider: process.env.STORAGE_PROVIDER || "local", // "local" | "supabase"
  local: {
    uploadPath: process.env.UPLOAD_PATH || "./uploads",
    publicBaseUrl: process.env.LOCAL_PUBLIC_BASE_URL || "http://localhost:5000",
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    bucket: process.env.SUPABASE_BUCKET || "documents",
  },
};

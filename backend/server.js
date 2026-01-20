const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const config = require("./shared/config/environment");
const connectDB = require("./shared/config/database");
const { testSupabaseConnection } = require("./shared/config/supabase");

const logger = require("./shared/middleware/requestLogger");
const errorHandler = require("./shared/middleware/errorHandler");
const { apiLimiter } = require("./shared/middleware/rateLimiter");

// ✅ Import routes ONLY (no controllers/validations here)
const authRoutes = require("./modules/auth/routes/authRoutes");
const documentRoutes = require("./modules/documents/routes/documentRoutes");
const storageRoutes = require("./modules/file-storage/routes/storageRoutes");

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet());

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(logger);
app.use("/api", apiLimiter);

// Serve local uploads if STORAGE_PROVIDER=local
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================================
// ROUTES
// ============================================

// Health
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API info
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NGU Admissions API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      documents: "/api/documents",
      storage: "/api/storage",
    },
  });
});

// ✅ Mount module routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/storage", storageRoutes);

// 404
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Errors
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const startServer = async () => {
  console.log("🚀 Starting NGU Admissions Backend...\n");

  const PORT = config.PORT;

  // Start listening FIRST so routes work even if external services fail
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    console.log(`📚 API Info: http://localhost:${PORT}/api`);
    console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
    console.log(`📄 Documents: http://localhost:${PORT}/api/documents`);
    console.log(`🗄️ Storage: http://localhost:${PORT}/api/storage\n`);
  });

  // Connect Mongo (don’t crash the server if it fails)
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }

  // Test Supabase (don’t crash server if it fails)
  try {
    await testSupabaseConnection();
    console.log("✅ Supabase connected");
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION!");
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();

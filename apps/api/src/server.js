const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

/**
 * Validate critical environment variables at startup
 * Fail fast if anything critical is missing
 */
const REQUIRED_ENV_VARS = [
  { key: "MONGO_URI", message: "MONGO_URI is required. Set it in .env file." },
  { key: "JWT_SECRET", message: "JWT_SECRET is required for authentication security." },
  { key: "ADMIN_EMAIL", message: "ADMIN_EMAIL is required for admin login." },
  { key: "ADMIN_PASSWORD_HASH", message: "ADMIN_PASSWORD_HASH is required for admin login security." },
];

const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v.key]);
if (missingVars.length > 0) {
  console.error("❌ CRITICAL: Missing required environment variables:");
  missingVars.forEach((v) => {
    console.error(`   - ${v.key}: ${v.message}`);
  });
  console.error("\n💡 Create a .env file in apps/api/ with these variables.");
  console.error("   See .env.example for reference.\n");
  process.exit(1);
}

// Warn if JWT_SECRET looks weak
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 16) {
  console.warn("⚠️  WARNING: JWT_SECRET is too short. Use a strong, random secret of at least 32 characters.");
}

// Warn about CORS
if (!process.env.CORS_ORIGIN) {
  console.warn("⚠️  WARNING: CORS_ORIGIN not set. Defaulting to '*' which is insecure for production.");
}

const app = require("./app");
const connectDb = require("./config/db");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    // Create HTTP server and attach Socket.IO
    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`✅ API listening on http://localhost:${PORT}`);
      console.log(`🔒 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔌 WebSocket ready (Socket.IO)`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  });

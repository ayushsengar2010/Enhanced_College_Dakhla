const dotenv = require("dotenv");
const http = require("http");
const mongoose = require("mongoose");
const logger = require("./utils/logger");

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
  logger.error("CRITICAL: Missing required environment variables:");
  missingVars.forEach((v) => {
    logger.error(`   - ${v.key}: ${v.message}`);
  });
  logger.error("💡 Create a .env file in apps/api/ with these variables. See .env.example for reference.");
  process.exit(1);
}

// Warn if JWT_SECRET looks weak
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 16) {
  logger.warn("JWT_SECRET is too short. Use a strong, random secret of at least 32 characters.");
}

// Warn about CORS
if (!process.env.CORS_ORIGIN) {
  logger.warn("CORS_ORIGIN not set. Defaulting to '*' which is insecure for production.");
}

const app = require("./app");
const connectDb = require("./config/db");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5000;

let server;

// Handle uncaught exceptions and unhandled promise rejections globally
process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION! Shutting down gracefully...", {
    error: error.message,
    stack: error.stack,
  });
  gracefulShutdown(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("UNHANDLED REJECTION! Shutting down gracefully...", {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  gracefulShutdown(1);
});

// Graceful shutdown handler
function gracefulShutdown(exitCode = 0) {
  logger.info("Starting graceful shutdown of HTTP server...");

  if (server) {
    server.close(() => {
      logger.info("HTTP server closed.");
      closeDbAndExit(exitCode);
    });

    // Force close after 10 seconds if connections are hanging
    setTimeout(() => {
      logger.warn("Forcing shutdown: active connections did not close in time.");
      closeDbAndExit(exitCode);
    }, 10000);
  } else {
    closeDbAndExit(exitCode);
  }
}

function closeDbAndExit(exitCode) {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    mongoose.connection.close(false)
      .then(() => {
        logger.info("MongoDB connection closed.");
        process.exit(exitCode);
      })
      .catch((err) => {
        logger.error("Error closing MongoDB connection:", err);
        process.exit(1);
      });
  } else {
    process.exit(exitCode);
  }
}

// Handle termination signals
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Starting graceful shutdown...");
  gracefulShutdown(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT (Ctrl+C) received. Starting graceful shutdown...");
  gracefulShutdown(0);
});

connectDb()
  .then(() => {
    // Create HTTP server and attach Socket.IO
    server = http.createServer(app);
    initSocket(server);

    // Gracefully handle server-level errors (like EADDRINUSE)
    server.on("error", (error) => {
      if (error.syscall !== "listen") {
        throw error;
      }
      switch (error.code) {
        case "EADDRINUSE":
          logger.error(`Port ${PORT} is already in use by another process. Please close the process or use a different port.`);
          process.exit(1);
          break;
        case "EACCES":
          logger.error(`Port ${PORT} requires elevated privileges.`);
          process.exit(1);
          break;
        default:
          logger.error("Server listen error:", error);
          process.exit(1);
      }
    });

    server.listen(PORT, () => {
      logger.info(`API listening on http://localhost:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info("WebSocket ready (Socket.IO)");
    });
  })
  .catch((err) => {
    logger.error("DB connection failed", err);
    process.exit(1);
  });

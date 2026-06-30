/**
 * Socket.IO server setup — real-time dashboard updates
 *
 * Events emitted:
 *   "dashboard:update" — when any key data changes (lead, college, blog, etc.)
 *   "notification"     — for toast-style alerts
 *
 * Admin clients join the "admin" room on connect (with valid token).
 */

const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const logger = require("./utils/logger");

let io = null;

/**
 * Initialize Socket.IO with the HTTP server
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",")
        : ["http://localhost:5173", "http://localhost:5000"],
      methods: ["GET", "POST"],
    },
    pingInterval: 30000,
    pingTimeout: 10000,
  });

  /* ── Authentication middleware ─────────────────────────────── */
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Invalid or expired token"));
    }
  });

  /* ── Connection handler ────────────────────────────────────── */
  io.on("connection", (socket) => {
    socket.join("admin");
    logger.info(`Socket connected: ${socket.id} (${socket.user?.email || "unknown"})`);

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info("Socket.IO initialized");
  return io;
};

/**
 * Emit a dashboard update event to all admin clients
 * Call this from any controller after data mutations
 */
const emitDashboardUpdate = (payload = {}) => {
  if (!io) return;
  io.to("admin").emit("dashboard:update", {
    timestamp: new Date().toISOString(),
    ...payload,
  });
};

/**
 * Emit a notification to admin clients
 */
const emitNotification = (message, type = "info") => {
  if (!io) return;
  io.to("admin").emit("notification", { message, type, timestamp: new Date().toISOString() });
};

module.exports = { initSocket, emitDashboardUpdate, emitNotification, getIO: () => io };

/**
 * Lightweight structured logging utility
 * Provides consistent logging with timestamps, levels, and context
 */

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL] || LOG_LEVELS.info;

const timestamp = () => new Date().toISOString();

const formatMessage = (level, message, context) => {
  const parts = [`[${timestamp()}]`, `[${level.toUpperCase()}]`, message];
  if (context) {
    parts.push(JSON.stringify(context));
  }
  return parts.join(" ");
};

const logger = {
  debug: (message, context) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.debug) {
      console.debug(formatMessage("debug", message, context));
    }
  },
  info: (message, context) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.info) {
      console.log(formatMessage("info", message, context));
    }
  },
  warn: (message, context) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.warn) {
      console.warn(formatMessage("warn", message, context));
    }
  },
  error: (message, context) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.error) {
      console.error(formatMessage("error", message, context));
    }
  },
};

module.exports = logger;

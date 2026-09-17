// Centralized application logger, using Winston.
//
// Why this exists: console.log/console.error scattered through the app
// gives no severity levels, no timestamps, and nothing persists once the
// terminal scrollback is gone — which made debugging the seed/schema
// issues earlier in this project purely a matter of scrolling PowerShell
// history. This module gives every part of the app one shared logger:
//   logger.info('message')     - normal operational events
//   logger.warn('message')     - recoverable issues worth noticing
//   logger.error('message', err) - failures, always also written to file
//
// In development, logs print to the console in a readable colored format.
// In all environments, warnings and errors are also appended to
// src/logs/error.log so they survive a terminal restart or a crash.

const path = require('path');
const winston = require('winston');
const env = require('./env');

const logsDir = path.join(__dirname, '..', 'logs');

const logger = winston.createLogger({
  level: env.isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
});

// Console output: readable during local development, still present (but
// terser) in production so container logs (e.g. `docker logs`) show
// activity without needing to exec into the container to read files.
logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`;
    })
  ),
}));

module.exports = logger;

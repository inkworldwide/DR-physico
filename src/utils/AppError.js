// A single error class for expected/operational failures — a course not
// found, a duplicate email at registration, an invalid quiz submission.
//
// Why this exists: right now, error handling is inconsistent — some
// places redirect with a flash message, some throw a raw Error, some
// just let the Postgres error bubble to the generic 500 page. This class
// gives every layer of the app a shared vocabulary: throw new AppError(
// 'Course not found', 404) anywhere, and the central error handler in
// app.js can tell "expected, show the user a clean message" apart from
// "unexpected bug, log full stack and show a generic error page."
//
// isOperational marks this as an anticipated failure (bad input, missing
// record, permission denied) as opposed to a programming bug or crash —
// useful later for deciding whether the process should keep running.
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

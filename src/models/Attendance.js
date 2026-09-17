const db = require('../db/connection');

const Attendance = {
  async markFaceRegistered(userId) {
    await db.prepare(`
      INSERT INTO face_registrations (user_id, registered_at) VALUES (?, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET registered_at = CURRENT_TIMESTAMP
    `).run(userId);
  },

  async isFaceRegisteredLocally(userId) {
    const row = await db.prepare(`SELECT 1 as x FROM face_registrations WHERE user_id = ?`).get(userId);
    return !!row;
  },

  async removeFaceRegistration(userId) {
    await db.prepare(`DELETE FROM face_registrations WHERE user_id = ?`).run(userId);
  },

  async recordAttendance({ userId, courseId, lessonId, method, matchDistance }) {
    await db.prepare(`
      INSERT INTO attendance_records (user_id, course_id, lesson_id, method, match_distance)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, courseId, lessonId || null, method || 'face', matchDistance ?? null);
  },

  async hasMarkedToday(userId, courseId) {
    const row = await db.prepare(`
      SELECT 1 as x FROM attendance_records
      WHERE user_id = ? AND course_id = ? AND marked_at::date = CURRENT_DATE
    `).get(userId, courseId);
    return !!row;
  },

  async forStudent(userId) {
    return db.prepare(`
      SELECT a.*, c.title as course_title, c.slug as course_slug
      FROM attendance_records a JOIN courses c ON a.course_id = c.id
      WHERE a.user_id = ? ORDER BY a.marked_at DESC
    `).all(userId);
  },

  async forCourse(courseId) {
    return db.prepare(`
      SELECT a.*, u.name as student_name, u.email as student_email
      FROM attendance_records a JOIN users u ON a.user_id = u.id
      WHERE a.course_id = ? ORDER BY a.marked_at DESC
    `).all(courseId);
  },

  async countForCourse(courseId) {
    const row = await db.prepare(`SELECT COUNT(*) as c FROM attendance_records WHERE course_id = ?`).get(courseId);
    return Number(row.c);
  }
};

module.exports = Attendance;

const db = require('../db/connection');

const Enrollment = {
  async isEnrolled(userId, courseId) {
    const row = await db.prepare(`SELECT 1 as x FROM enrollments WHERE user_id = ? AND course_id = ?`).get(userId, courseId);
    return !!row;
  },

  async find(userId, courseId) {
    return db.prepare(`SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?`).get(userId, courseId);
  },

  async enroll(userId, courseId) {
    await db.prepare(`INSERT INTO enrollments (user_id, course_id) VALUES (?, ?) ON CONFLICT (user_id, course_id) DO NOTHING`).run(userId, courseId);
    await db.prepare(`UPDATE courses SET students_count = students_count + 1 WHERE id = ?`).run(courseId);
    return this.find(userId, courseId);
  },

  async myCourses(userId) {
    const rows = await db.prepare(`
      SELECT e.*, c.title, c.slug, c.thumbnail, c.duration_hours, c.level, c.target_exam, c.course_type,
             c.category_id, cat.name as category_name, cat.slug as category_slug, cat.year as category_year,
             u.name as instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      JOIN users u ON c.instructor_id = u.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `).all(userId);
    return rows.map(r => {
      const validFrom = r.valid_from || r.enrolled_at;
      let validUntil = r.valid_until;
      if (!validUntil && validFrom) {
        const d = new Date(validFrom);
        d.setDate(d.getDate() + 365);
        validUntil = d.toISOString();
      }
      let daysLeft = null;
      let isExpiringSoon = false;
      let isExpired = false;
      if (validUntil) {
        const diffMs = new Date(validUntil).getTime() - Date.now();
        daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        isExpiringSoon = daysLeft >= 0 && daysLeft <= 3;
        isExpired = daysLeft < 0;
      }
      return { 
        ...r, 
        progress_percent: Number(r.progress_percent),
        valid_from: validFrom,
        valid_until: validUntil,
        plan_type: r.plan_type || 'Annual Subscription',
        days_left: daysLeft,
        is_expiring_soon: isExpiringSoon,
        is_expired: isExpired
      };
    });
  },

  async updateValidity(userId, courseId, { validFrom, validUntil, planType }) {
    await db.prepare(`
      UPDATE enrollments 
      SET valid_from = COALESCE(?, valid_from),
          valid_until = COALESCE(?, valid_until),
          plan_type = COALESCE(?, plan_type)
      WHERE user_id = ? AND course_id = ?
    `).run(validFrom || null, validUntil || null, planType || null, userId, courseId);
  },

  async extendValidity(userId, courseId, daysToAdd = 30) {
    const current = await this.find(userId, courseId);
    let baseDate = current && current.valid_until ? new Date(current.valid_until) : new Date();
    if (baseDate < new Date()) {
      baseDate = new Date();
    }
    baseDate.setDate(baseDate.getDate() + Number(daysToAdd));
    await db.prepare(`
      UPDATE enrollments 
      SET valid_until = ?
      WHERE user_id = ? AND course_id = ?
    `).run(baseDate.toISOString(), userId, courseId);
    return baseDate;
  },

  async recalculateProgress(userId, courseId) {
    const totalRow = await db.prepare(`SELECT COUNT(*) as c FROM lessons WHERE course_id = ?`).get(courseId);
    const total = Number(totalRow.c);
    const doneRow = await db.prepare(`
      SELECT COUNT(*) as c FROM lesson_progress
      WHERE user_id = ? AND course_id = ? AND is_completed = 1
    `).get(userId, courseId);
    const done = Number(doneRow.c);
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    const status = percent >= 100 ? 'completed' : 'active';
    const completedAt = percent >= 100 ? new Date().toISOString() : null;
    await db.prepare(`
      UPDATE enrollments SET progress_percent = ?, status = ?, completed_at = COALESCE(?, completed_at)
      WHERE user_id = ? AND course_id = ?
    `).run(percent, status, completedAt, userId, courseId);
    return percent;
  },

  async markLessonComplete(userId, lessonId, courseId) {
    await db.prepare(`
      INSERT INTO lesson_progress (user_id, lesson_id, course_id, is_completed, completed_at)
      VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET is_completed = 1, completed_at = CURRENT_TIMESTAMP
    `).run(userId, lessonId, courseId);
    return this.recalculateProgress(userId, courseId);
  },

  async getCompletedLessonIds(userId, courseId) {
    const rows = await db.prepare(`
      SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND course_id = ? AND is_completed = 1
    `).all(userId, courseId);
    return rows.map(r => r.lesson_id);
  },

  async dashboardStats(userId) {
    const enrolled = Number((await db.prepare(`SELECT COUNT(*) as c FROM enrollments WHERE user_id = ?`).get(userId)).c);
    const completed = Number((await db.prepare(`SELECT COUNT(*) as c FROM enrollments WHERE user_id = ? AND status='completed'`).get(userId)).c);
    const certificates = Number((await db.prepare(`SELECT COUNT(*) as c FROM certificates WHERE user_id = ?`).get(userId)).c);
    const avgRow = await db.prepare(`SELECT AVG(progress_percent) as a FROM enrollments WHERE user_id = ?`).get(userId);
    const avgProgress = avgRow.a || 0;
    return { enrolled, completed, certificates, avgProgress: Math.round(Number(avgProgress)) };
  },

  async studentsForCourse(courseId) {
    const rows = await db.prepare(`
      SELECT e.*, u.name, u.email, u.avatar
      FROM enrollments e JOIN users u ON e.user_id = u.id
      WHERE e.course_id = ? ORDER BY e.enrolled_at DESC
    `).all(courseId);
    return rows.map(r => ({ ...r, progress_percent: Number(r.progress_percent) }));
  },

  async recentForInstructor(instructorId, limit = 10) {
    return db.prepare(`
      SELECT e.*, u.name as student_name, u.avatar as student_avatar, c.title as course_title
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON e.user_id = u.id
      WHERE c.instructor_id = ?
      ORDER BY e.enrolled_at DESC LIMIT ?
    `).all(instructorId, limit);
  }
};

module.exports = Enrollment;

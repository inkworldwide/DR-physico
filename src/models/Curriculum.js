const db = require('../db/connection');

const Curriculum = {
  // ----- MODULES -----
  async addModule(courseId, title) {
    const moduleTitle = typeof title === 'object' ? (title.title || '') : (title || '');
    const posRow = await db.prepare(`SELECT COALESCE(MAX(position)+1, 0) as p FROM modules WHERE course_id = ?`).get(courseId);
    const pos = posRow ? posRow.p : 0;
    const info = await db.prepare(`INSERT INTO modules (course_id, title, position) VALUES (?, ?, ?) RETURNING id`).run(courseId, moduleTitle, pos);
    return info.lastInsertRowid;
  },
  async getModule(id) {
    return db.prepare(`SELECT * FROM modules WHERE id = ?`).get(id);
  },
  async updateModule(id, title) {
    await db.prepare(`UPDATE modules SET title = ? WHERE id = ?`).run(title, id);
  },
  async deleteModule(id) {
    await db.prepare(`DELETE FROM modules WHERE id = ?`).run(id);
  },

  // ----- LESSONS -----
  async addLesson(moduleId, courseId, data) {
    const posRow = await db.prepare(`SELECT COALESCE(MAX(position)+1, 0) as p FROM lessons WHERE module_id = ?`).get(moduleId);
    const pos = posRow.p;
    const info = await db.prepare(`
      INSERT INTO lessons (module_id, course_id, title, type, video_url, content, duration_minutes, position, is_preview, quiz_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).run(moduleId, courseId, data.title, data.type || 'video', data.video_url || null,
      data.content || null, data.duration_minutes || 10, pos, data.is_preview ? 1 : 0, data.quiz_id || null);
    return info.lastInsertRowid;
  },
  async getLesson(id) {
    return db.prepare(`SELECT * FROM lessons WHERE id = ?`).get(id);
  },
  async getLessonWithCourse(id) {
    return db.prepare(`
      SELECT l.*, c.title as course_title, c.slug as course_slug, c.instructor_id
      FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = ?
    `).get(id);
  },
  async updateLesson(id, data) {
    await db.prepare(`
      UPDATE lessons SET title=?, type=?, video_url=?, content=?, duration_minutes=?, is_preview=?, quiz_id=?
      WHERE id=?
    `).run(data.title, data.type, data.video_url || null, data.content || null,
      data.duration_minutes || 10, data.is_preview ? 1 : 0, data.quiz_id || null, id);
  },
  async deleteLesson(id) {
    await db.prepare(`DELETE FROM lessons WHERE id = ?`).run(id);
  },

  // ----- NAVIGATION HELPERS -----
  async getNextLesson(courseId, currentPosition, currentModulePosition) {
    return db.prepare(`
      SELECT l.* FROM lessons l JOIN modules m ON l.module_id = m.id
      WHERE l.course_id = ?
      AND (m.position > ? OR (m.position = ? AND l.position > ?))
      ORDER BY m.position, l.position LIMIT 1
    `).get(courseId, currentModulePosition, currentModulePosition, currentPosition);
  },

  async getPrevLesson(courseId, currentPosition, currentModulePosition) {
    return db.prepare(`
      SELECT l.* FROM lessons l JOIN modules m ON l.module_id = m.id
      WHERE l.course_id = ?
      AND (m.position < ? OR (m.position = ? AND l.position < ?))
      ORDER BY m.position DESC, l.position DESC LIMIT 1
    `).get(courseId, currentModulePosition, currentModulePosition, currentPosition);
  },

  async getLessonContext(lessonId) {
    return db.prepare(`
      SELECT l.*, m.position as module_position, m.title as module_title
      FROM lessons l JOIN modules m ON l.module_id = m.id
      WHERE l.id = ?
    `).get(lessonId);
  }
};

module.exports = Curriculum;

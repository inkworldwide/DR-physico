const db = require('../db/connection');

const Order = {
  async all({ status } = {}) {
    if (status) {
      return db.prepare(`
        SELECT o.*, 
               u.name as student_name, u.email as student_email, u.avatar as student_avatar, u.role as student_role,
               c.title as course_title, c.slug as course_slug,
               cat.name as category_name
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        JOIN courses c ON o.course_id = c.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        WHERE COALESCE(o.is_deleted, 0) = 0 AND o.status = ?
        ORDER BY o.created_at DESC
      `).all(status);
    }
    return db.prepare(`
      SELECT o.*, 
             u.name as student_name, u.email as student_email, u.avatar as student_avatar, u.role as student_role,
             c.title as course_title, c.slug as course_slug,
             cat.name as category_name
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      JOIN courses c ON o.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE COALESCE(o.is_deleted, 0) = 0
      ORDER BY o.created_at DESC
    `).all();
  },

  async deleted() {
    return db.prepare(`
      SELECT o.*, 
             u.name as student_name, u.email as student_email, u.avatar as student_avatar, u.role as student_role,
             c.title as course_title, c.slug as course_slug,
             cat.name as category_name
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      JOIN courses c ON o.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE COALESCE(o.is_deleted, 0) = 1
      ORDER BY o.created_at DESC
    `).all();
  },

  async findById(id) {
    return db.prepare(`
      SELECT o.*, u.name as student_name, u.email as student_email, c.title as course_title
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      JOIN courses c ON o.course_id = c.id 
      WHERE o.id = ?
    `).get(id);
  },

  async softDelete(id) {
    return db.prepare(`UPDATE orders SET is_deleted = 1 WHERE id = ?`).run(id);
  },

  async restore(id) {
    return db.prepare(`UPDATE orders SET is_deleted = 0 WHERE id = ?`).run(id);
  },

  async permanentDelete(id) {
    return db.prepare(`DELETE FROM orders WHERE id = ?`).run(id);
  }
};

module.exports = Order;

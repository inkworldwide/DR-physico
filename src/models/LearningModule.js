const db = require('../db/connection');

class LearningModule {
  static async all({ category_id, course_id, question_type, search, is_deleted = 0 } = {}) {
    let sql = `
      SELECT q.*, c.name as category_name, c.slug as category_slug, c.year as category_year,
             co.title as course_title, co.slug as course_slug
      FROM learning_module_questions q
      LEFT JOIN categories c ON q.category_id = c.id
      LEFT JOIN courses co ON q.course_id = co.id
      WHERE q.is_deleted = ?
    `;
    const params = [is_deleted];

    if (category_id) {
      sql += ` AND q.category_id = ?`;
      params.push(category_id);
    }
    if (course_id) {
      sql += ` AND q.course_id = ?`;
      params.push(course_id);
    }
    if (question_type) {
      sql += ` AND q.question_type = ?`;
      params.push(question_type);
    }
    if (search) {
      sql += ` AND (q.question ILIKE ? OR q.title ILIKE ? OR q.topic ILIKE ? OR c.name ILIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ` ORDER BY q.created_at DESC`;
    return db.prepare(sql).all(...params);
  }

  static async findById(id) {
    return db.prepare(`
      SELECT q.*, c.name as category_name, c.slug as category_slug,
             co.title as course_title
      FROM learning_module_questions q
      LEFT JOIN categories c ON q.category_id = c.id
      LEFT JOIN courses co ON q.course_id = co.id
      WHERE q.id = ?
    `).get(id);
  }

  static async create({ category_id, course_id, question_type, title, question, options_json, correct_option, explanation, difficulty, topic, marks, model_answer, document_url }) {
    const res = await db.prepare(`
      INSERT INTO learning_module_questions
        (category_id, course_id, question_type, title, question, options_json, correct_option, explanation, difficulty, topic, marks, model_answer, document_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `).run(
      category_id,
      course_id || null,
      question_type,
      title || null,
      question,
      options_json || null,
      correct_option !== undefined && correct_option !== '' ? parseInt(correct_option, 10) : 0,
      explanation || null,
      difficulty || 'Medium',
      topic || null,
      marks ? parseInt(marks, 10) : (question_type === 'mcq' ? 1 : question_type === 'small_qa' ? 5 : 15),
      model_answer || null,
      document_url || null
    );
    return res.lastInsertRowid || res.id;
  }

  static async createMany(questionsList) {
    const insertedIds = [];
    for (const q of questionsList) {
      if (!q.question || !q.question.trim()) continue;
      const id = await this.create(q);
      insertedIds.push(id);
    }
    return insertedIds;
  }

  static async update(id, { category_id, course_id, question_type, title, question, options_json, correct_option, explanation, difficulty, topic, marks, model_answer, document_url }) {
    await db.prepare(`
      UPDATE learning_module_questions
      SET category_id = ?,
          course_id = ?,
          question_type = ?,
          title = ?,
          question = ?,
          options_json = ?,
          correct_option = ?,
          explanation = ?,
          difficulty = ?,
          topic = ?,
          marks = ?,
          model_answer = ?,
          document_url = COALESCE(?, document_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      category_id,
      course_id || null,
      question_type,
      title || null,
      question,
      options_json || null,
      correct_option !== undefined && correct_option !== '' ? parseInt(correct_option, 10) : 0,
      explanation || null,
      difficulty || 'Medium',
      topic || null,
      marks ? parseInt(marks, 10) : (question_type === 'mcq' ? 1 : question_type === 'small_qa' ? 5 : 15),
      model_answer || null,
      document_url || null,
      id
    );
  }

  static async delete(id) {
    return db.prepare(`UPDATE learning_module_questions SET is_deleted = 1 WHERE id = ?`).run(id);
  }

  static async restore(id) {
    return db.prepare(`UPDATE learning_module_questions SET is_deleted = 0 WHERE id = ?`).run(id);
  }

  static async permanentDelete(id) {
    return db.prepare(`DELETE FROM learning_module_questions WHERE id = ?`).run(id);
  }

  static async toggleActive(id) {
    return db.prepare(`UPDATE learning_module_questions SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ?`).run(id);
  }

  // --- Documents & PDF/DOC attachments ---
  static async getDocuments({ category_id, course_id, doc_type, is_deleted = 0 } = {}) {
    let sql = `
      SELECT d.*, c.name as category_name, c.slug as category_slug,
             co.title as course_title
      FROM learning_module_documents d
      LEFT JOIN categories c ON d.category_id = c.id
      LEFT JOIN courses co ON d.course_id = co.id
      WHERE d.is_deleted = ?
    `;
    const params = [is_deleted];

    if (category_id) {
      sql += ` AND d.category_id = ?`;
      params.push(category_id);
    }
    if (course_id) {
      sql += ` AND d.course_id = ?`;
      params.push(course_id);
    }
    if (doc_type && doc_type !== 'all') {
      sql += ` AND d.doc_type = ?`;
      params.push(doc_type);
    }

    sql += ` ORDER BY d.created_at DESC`;
    return db.prepare(sql).all(...params);
  }

  static async createDocument({ category_id, course_id, doc_type, title, file_url, file_name, file_type, file_size, description }) {
    const res = await db.prepare(`
      INSERT INTO learning_module_documents
        (category_id, course_id, doc_type, title, file_url, file_name, file_type, file_size, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `).run(
      category_id,
      course_id || null,
      doc_type || 'all',
      title,
      file_url,
      file_name || null,
      file_type || null,
      file_size || null,
      description || null
    );
    return res.lastInsertRowid || res.id;
  }

  static async deleteDocument(id) {
    return db.prepare(`UPDATE learning_module_documents SET is_deleted = 1 WHERE id = ?`).run(id);
  }

  static async permanentDeleteDocument(id) {
    return db.prepare(`DELETE FROM learning_module_documents WHERE id = ?`).run(id);
  }

  // --- Subject specific query for public frontend ---
  static async getQuestionsForCategory(categoryId, categorySlug) {
    let questions = [];
    if (categoryId) {
      questions = await db.prepare(`
        SELECT * FROM learning_module_questions
        WHERE category_id = ? AND is_active = 1 AND is_deleted = 0
        ORDER BY created_at DESC
      `).all(categoryId);
    }
    return questions;
  }

  static async getDocumentsForCategory(categoryId) {
    if (!categoryId) return [];
    return db.prepare(`
      SELECT * FROM learning_module_documents
      WHERE category_id = ? AND is_active = 1 AND is_deleted = 0
      ORDER BY created_at DESC
    `).all(categoryId);
  }

  static async stats() {
    const totalQuestions = Number((await db.prepare(`SELECT COUNT(*) as c FROM learning_module_questions WHERE is_deleted = 0`).get()).c);
    const totalMcqs = Number((await db.prepare(`SELECT COUNT(*) as c FROM learning_module_questions WHERE question_type = 'mcq' AND is_deleted = 0`).get()).c);
    const totalLargeQa = Number((await db.prepare(`SELECT COUNT(*) as c FROM learning_module_questions WHERE question_type = 'large_qa' AND is_deleted = 0`).get()).c);
    const totalSmallQa = Number((await db.prepare(`SELECT COUNT(*) as c FROM learning_module_questions WHERE question_type = 'small_qa' AND is_deleted = 0`).get()).c);
    const totalDocs = Number((await db.prepare(`SELECT COUNT(*) as c FROM learning_module_documents WHERE is_deleted = 0`).get()).c);
    const totalSubjectsCovered = Number((await db.prepare(`SELECT COUNT(DISTINCT category_id) as c FROM learning_module_questions WHERE is_deleted = 0`).get()).c);

    return {
      totalQuestions,
      totalMcqs,
      totalLargeQa,
      totalSmallQa,
      totalDocs,
      totalSubjectsCovered
    };
  }

  static async getStats() {
    return this.stats();
  }
}

module.exports = LearningModule;

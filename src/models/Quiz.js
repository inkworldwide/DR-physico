const db = require('../db/connection');

const Quiz = {
  async findById(id) {
    return db.prepare(`SELECT * FROM quizzes WHERE id = ?`).get(id);
  },

  async getQuestions(quizId) {
    return db.prepare(`SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY position`).all(quizId);
  },

  async byCourse(courseId) {
    return db.prepare(`SELECT * FROM quizzes WHERE course_id = ?`).all(courseId);
  },

  async create({ course_id, title, description, time_limit_minutes, pass_percentage }) {
    const info = await db.prepare(`
      INSERT INTO quizzes (course_id, title, description, time_limit_minutes, pass_percentage)
      VALUES (?, ?, ?, ?, ?) RETURNING id
    `).run(course_id, title, description, time_limit_minutes || 30, pass_percentage || 60);
    return this.findById(info.lastInsertRowid);
  },

  async addQuestion(quizId, q) {
    const info = await db.prepare(`
      INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, position)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT MAX(position)+1 FROM quiz_questions WHERE quiz_id = ?), 0))
      RETURNING id
    `).run(quizId, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.explanation || null, quizId);
    return info.lastInsertRowid;
  },

  async deleteQuestion(id) {
    await db.prepare(`DELETE FROM quiz_questions WHERE id = ?`).run(id);
  },

  async delete(id) {
    await db.prepare(`DELETE FROM quizzes WHERE id = ?`).run(id);
  },

  /**
   * Grades a submitted attempt.
   * answers: { [questionId]: 'a'|'b'|'c'|'d' }
   */
  async gradeAttempt(quizId, userId, answers) {
    const questions = await this.getQuestions(quizId);
    const quiz = await this.findById(quizId);
    let correct = 0;
    const detailed = questions.map(q => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correct_option;
      if (isCorrect) correct++;
      return { ...q, selected, isCorrect };
    });
    const total = questions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= quiz.pass_percentage ? 1 : 0;

    await db.prepare(`
      INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct_answers, passed, answers_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, quizId, score, total, correct, passed, JSON.stringify(answers));

    return { score, total, correct, passed: !!passed, passPercentage: quiz.pass_percentage, detailed };
  },

  async attemptsForUser(userId, quizId) {
    return db.prepare(`
      SELECT * FROM quiz_attempts WHERE user_id = ? AND quiz_id = ? ORDER BY attempted_at DESC
    `).all(userId, quizId);
  },

  async bestAttempt(userId, quizId) {
    return db.prepare(`
      SELECT * FROM quiz_attempts WHERE user_id = ? AND quiz_id = ? ORDER BY score DESC LIMIT 1
    `).get(userId, quizId);
  },

  async allAttemptsForUser(userId) {
    return db.prepare(`
      SELECT qa.*, q.title as quiz_title, q.pass_percentage, c.title as course_title, c.slug as course_slug
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      JOIN courses c ON q.course_id = c.id
      WHERE qa.user_id = ?
      ORDER BY qa.attempted_at DESC
    `).all(userId);
  }
};

module.exports = Quiz;

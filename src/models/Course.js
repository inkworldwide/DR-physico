const db = require('../db/connection');

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const Course = {
  slugify,

  async findBySlug(slug) {
    return db.prepare(`
      SELECT c.*, cat.name as category_name, cat.slug as category_slug,
             u.name as instructor_name, u.avatar as instructor_avatar,
             u.headline as instructor_headline, u.bio as instructor_bio
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      JOIN users u ON c.instructor_id = u.id
      WHERE c.slug = ?
    `).get(slug);
  },

  async findById(id) {
    return db.prepare(`
      SELECT c.*, cat.name as category_name, cat.slug as category_slug,
             u.name as instructor_name, u.avatar as instructor_avatar,
             u.headline as instructor_headline, u.bio as instructor_bio
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      JOIN users u ON c.instructor_id = u.id
      WHERE c.id = ?
    `).get(id);
  },

  async all({ categoryId } = {}) {
    let query = `
      SELECT c.*, cat.name as category_name, cat.slug as category_slug,
             u.name as instructor_name, u.avatar as instructor_avatar
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      JOIN users u ON c.instructor_id = u.id
      WHERE COALESCE(c.is_deleted, 0) = 0
    `;
    const params = [];
    if (categoryId) {
      query += ` AND c.category_id = ?`;
      params.push(categoryId);
    }
    query += ` ORDER BY c.created_at DESC`;
    return db.prepare(query).all(...params);
  },

  async deletedCourses({ categoryId } = {}) {
    let query = `
      SELECT c.*, cat.name as category_name, cat.slug as category_slug,
             u.name as instructor_name, u.avatar as instructor_avatar
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      JOIN users u ON c.instructor_id = u.id
      WHERE COALESCE(c.is_deleted, 0) = 1
    `;
    const params = [];
    if (categoryId) {
      query += ` AND c.category_id = ?`;
      params.push(categoryId);
    }
    query += ` ORDER BY c.created_at DESC`;
    return db.prepare(query).all(...params);
  },

  async softDelete(id) {
    await db.prepare(`UPDATE courses SET is_deleted = 1 WHERE id = ?`).run(id);
  },

  async restore(id) {
    await db.prepare(`UPDATE courses SET is_deleted = 0 WHERE id = ?`).run(id);
  },

  async allPublished({ category, search, level, sort } = {}) {
    let query = `
      SELECT c.*, cat.name as category_name, cat.slug as category_slug,
             u.name as instructor_name, u.avatar as instructor_avatar
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      JOIN users u ON c.instructor_id = u.id
      WHERE c.status = 'published' AND COALESCE(c.is_deleted, 0) = 0 AND COALESCE(cat.is_deleted, 0) = 0
    `;
    const params = [];
    if (category) { query += ` AND cat.slug = ?`; params.push(category); }
    if (level) { query += ` AND c.level = ?`; params.push(level); }
    if (search) { query += ` AND (c.title LIKE ? OR c.subtitle LIKE ? OR c.target_exam LIKE ?)`; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    if (sort === 'price_low') query += ` ORDER BY COALESCE(c.discount_price, c.price) ASC`;
    else if (sort === 'price_high') query += ` ORDER BY COALESCE(c.discount_price, c.price) DESC`;
    else if (sort === 'rating') query += ` ORDER BY c.rating_avg DESC`;
    else if (sort === 'popular') query += ` ORDER BY c.students_count DESC`;
    else query += ` ORDER BY c.created_at DESC`;

    return db.prepare(query).all(...params);
  },

  async featured(limit = 6) {
    return db.prepare(`
      SELECT c.*, cat.name as category_name, cat.slug as category_slug,
             u.name as instructor_name, u.avatar as instructor_avatar
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      JOIN users u ON c.instructor_id = u.id
      WHERE c.status = 'published' AND c.is_featured = 1
      ORDER BY c.rating_avg DESC LIMIT ?
    `).all(limit);
  },

  async byInstructor(instructorId) {
    return db.prepare(`
      SELECT c.*, cat.name as category_name
      FROM courses c LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.instructor_id = ? ORDER BY c.created_at DESC
    `).all(instructorId);
  },

  async create(data) {
    // PhysioEdvance is a free platform — every course is published at no cost,
    // regardless of what an instructor enters in the form.
    data = { ...data, price: 0, discount_price: null };
    const slug = slugify(data.title || 'course') + '-' + Date.now().toString().slice(-5);
    const visibility = data.visibility === 'private' ? 'private' : 'public';
    const createdBy = data.created_by || data.instructor_id || null;
    const info = await db.prepare(`
      INSERT INTO courses (
        title, slug, subtitle, description, thumbnail, category_id, instructor_id,
        level, language, price, discount_price, duration_hours, target_exam, status,
        requirements, learning_outcomes, course_type, visibility, created_by
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ) RETURNING id
    `).run(
      data.title || 'Untitled Course',
      slug,
      data.subtitle || '',
      data.description || '',
      data.thumbnail || '/images/courses/course-placeholder.jpg',
      data.category_id || 1,
      data.instructor_id,
      data.level || 'Beginner',
      data.language || 'English',
      data.price || 0,
      data.discount_price || null,
      parseFloat(data.duration_hours) || 12,
      data.target_exam || 'BPT 1st Year',
      data.status || 'draft',
      data.requirements || '',
      data.learning_outcomes || '',
      data.course_type || 'video_hybrid',
      visibility,
      createdBy
    );
    return this.findById(info.lastInsertRowid);
  },

  async update(id, data) {
    // Free platform: price changes from the instructor form are ignored.
    data = { ...data, price: 0, discount_price: null };
    const visibility = data.visibility ? (data.visibility === 'private' ? 'private' : 'public') : undefined;
    await db.prepare(`
      UPDATE courses SET
        title=?, subtitle=?, description=?,
        category_id=?, level=?, language=?,
        price=?, discount_price=?, duration_hours=?,
        target_exam=?, status=?, requirements=?,
        learning_outcomes=?,
        course_type = COALESCE(?, course_type),
        thumbnail = COALESCE(?, thumbnail),
        visibility = COALESCE(?, visibility),
        updated_at = CURRENT_TIMESTAMP
      WHERE id=?
    `).run(
      data.title, data.subtitle, data.description, data.category_id, data.level, data.language,
      data.price, data.discount_price, data.duration_hours, data.target_exam, data.status,
      data.requirements, data.learning_outcomes, data.course_type || 'video_hybrid', data.thumbnail,
      visibility, id
    );
    return this.findById(id);
  },

  async delete(id) {
    try {
      const course = await db.prepare(`SELECT * FROM courses WHERE id = ?`).get(id);
      if (!course) return;

      const categoryId = course.category_id;

      // 1. Delete note documents and clean up files from disk
      try {
        const notesToDelete = await db.prepare(`
          SELECT * FROM notes WHERE course_id = ?
        `).all(id);

        const fs = require('fs');
        const path = require('path');
        for (const n of notesToDelete) {
          if (n.file_url && n.file_url.startsWith('/uploads/notes/')) {
            const filePath = path.join(__dirname, '..', '..', 'public', n.file_url);
            if (fs.existsSync(filePath)) {
              try { fs.unlinkSync(filePath); } catch (fErr) {}
            }
          }
        }

        await db.prepare(`DELETE FROM notes WHERE course_id = ?`).run(id);
      } catch (notesErr) {
        console.error('Cascade Delete Notes Error:', notesErr);
      }

      // 2. Delete modules & lessons
      try {
        const modules = await db.prepare(`SELECT id FROM modules WHERE course_id = ?`).all(id);
        for (const m of modules) {
          await db.prepare(`DELETE FROM lessons WHERE module_id = ?`).run(m.id);
        }
        await db.prepare(`DELETE FROM modules WHERE course_id = ?`).run(id);
      } catch (modErr) {
        console.error('Cascade Delete Modules Error:', modErr);
      }

      // 3. Delete quizzes & questions
      try {
        const quizzes = await db.prepare(`SELECT id FROM quizzes WHERE course_id = ?`).all(id);
        for (const q of quizzes) {
          await db.prepare(`DELETE FROM quiz_questions WHERE quiz_id = ?`).run(q.id);
        }
        await db.prepare(`DELETE FROM quizzes WHERE course_id = ?`).run(id);
      } catch (quizErr) {
        console.error('Cascade Delete Quizzes Error:', quizErr);
      }

      // 4. Delete enrollments & reviews
      try {
        await db.prepare(`DELETE FROM enrollments WHERE course_id = ?`).run(id);
        await db.prepare(`DELETE FROM reviews WHERE course_id = ?`).run(id);
      } catch (relErr) {}

      // 5. Delete course row
      await db.prepare(`DELETE FROM courses WHERE id = ?`).run(id);
    } catch (err) {
      console.error('Course.delete Error:', err);
      // Fallback simple delete
      await db.prepare(`DELETE FROM courses WHERE id = ?`).run(id);
    }
  },

  async setFeatured(id, isFeatured) {
    await db.prepare(`UPDATE courses SET is_featured = ? WHERE id = ?`).run(isFeatured ? 1 : 0, id);
  },

  async getModulesWithLessons(courseId) {
    const modules = await db.prepare(`SELECT * FROM modules WHERE course_id = ? ORDER BY position`).all(courseId);
    const lessonStmt = db.prepare(`SELECT * FROM lessons WHERE module_id = ? ORDER BY position`);
    const result = [];
    for (const m of modules) {
      const lessons = await lessonStmt.all(m.id);
      result.push({ ...m, lessons });
    }
    return result;
  },

  async addModule(courseId, data) {
    const Curriculum = require('./Curriculum');
    return Curriculum.addModule(courseId, data);
  },

  async addLesson(moduleId, data) {
    const Curriculum = require('./Curriculum');
    const moduleRow = await db.prepare(`SELECT course_id FROM modules WHERE id = ?`).get(moduleId);
    const courseId = moduleRow ? moduleRow.course_id : 1;
    return Curriculum.addLesson(moduleId, courseId, data);
  },

  async totalLessonsCount(courseId) {
    const row = await db.prepare(`SELECT COUNT(*) as count FROM lessons WHERE course_id = ?`).get(courseId);
    return Number(row.count);
  },

  async getReviews(courseId) {
    return db.prepare(`
      SELECT r.*, u.name as user_name, u.avatar as user_avatar
      FROM reviews r JOIN users u ON r.user_id = u.id
      WHERE r.course_id = ? ORDER BY r.created_at DESC
    `).all(courseId);
  },

  async categories() {
    return db.prepare(`SELECT * FROM categories ORDER BY (year IS NULL), year, id ASC`).all();
  },

  async ensureAllCategoriesExist() {
    const { YEAR_SUBJECTS, OTHER_SUBJECTS, slugify } = require('../config/subjectTaxonomy');
    for (const [year, subjects] of Object.entries(YEAR_SUBJECTS)) {
      for (const name of subjects) {
        const slug = slugify(name);
        const exists = await db.prepare("SELECT id FROM categories WHERE slug = ?").get(slug);
        if (!exists) {
          await db.prepare("INSERT INTO categories (name, slug, icon, description, year, is_other_subject) VALUES (?, ?, 'ri-pulse-line', ?, ?, 0)")
            .run(name, slug, `${name} — Year ${year} subject`, parseInt(year));
        }
      }
    }
    for (const name of OTHER_SUBJECTS) {
      const slug = slugify(name);
      const exists = await db.prepare("SELECT id FROM categories WHERE slug = ?").get(slug);
      if (!exists) {
        await db.prepare("INSERT INTO categories (name, slug, icon, description, year, is_other_subject) VALUES (?, ?, 'ri-stack-line', ?, NULL, 1)")
          .run(name, slug, `${name} — elective / cross-cutting subject`);
      }
    }
  },

  async countCoursesByCategory() {
    await this.ensureAllCategoriesExist();
    const rows = await db.prepare(`
      SELECT cat.id, cat.name, cat.slug, cat.icon, cat.year, cat.is_other_subject,
             COUNT(DISTINCT c.id) as course_count,
             COUNT(DISTINCT e.user_id) as student_count
      FROM categories cat
      LEFT JOIN courses c ON c.category_id = cat.id AND c.status = 'published' AND COALESCE(c.is_deleted, 0) = 0
      LEFT JOIN enrollments e ON e.course_id = c.id
      WHERE COALESCE(cat.is_deleted, 0) = 0
      GROUP BY cat.id, cat.name, cat.slug, cat.icon, cat.year, cat.is_other_subject
      ORDER BY (cat.year IS NULL), cat.year, cat.id ASC
    `).all();
    return rows.map(r => ({
      ...r,
      course_count: Number(r.course_count || 0),
      student_count: Number(r.student_count || 0)
    }));
  },

  async deletedCategories() {
    const rows = await db.prepare(`
      SELECT cat.id, cat.name, cat.slug, cat.icon, cat.year, cat.is_other_subject,
             COUNT(DISTINCT c.id) as course_count,
             COUNT(DISTINCT e.user_id) as student_count
      FROM categories cat
      LEFT JOIN courses c ON c.category_id = cat.id AND COALESCE(c.is_deleted, 0) = 0
      LEFT JOIN enrollments e ON e.course_id = c.id
      WHERE COALESCE(cat.is_deleted, 0) = 1
      GROUP BY cat.id, cat.name, cat.slug, cat.icon, cat.year, cat.is_other_subject
      ORDER BY (cat.year IS NULL), cat.year, cat.id ASC
    `).all();
    return rows.map(r => ({
      ...r,
      course_count: Number(r.course_count || 0),
      student_count: Number(r.student_count || 0)
    }));
  },

  async softDeleteCategory(id) {
    await db.prepare(`UPDATE categories SET is_deleted = 1 WHERE id = ?`).run(id);
  },

  async updateCategory(id, { name, slug, icon, description, year }) {
    const parsedYear = year ? parseInt(year, 10) : null;
    await db.prepare(`
      UPDATE categories 
      SET name = ?, slug = ?, icon = ?, description = ?, year = ?, is_other_subject = ?
      WHERE id = ?
    `).run(name, slug, icon || 'ri-book-open-line', description || '', parsedYear, parsedYear ? 0 : 1, id);
    return db.prepare(`SELECT * FROM categories WHERE id = ?`).get(id);
  },

  async restoreCategory(id) {
    await db.prepare(`UPDATE categories SET is_deleted = 0 WHERE id = ?`).run(id);
  },

  async permanentDeleteCategory(id) {
    // 1. Delete associated notes
    try {
      await db.prepare(`DELETE FROM notes WHERE category_id = ?`).run(id);
    } catch (e) {}

    // 2. Delete associated courses permanently
    try {
      const courses = await db.prepare(`SELECT id FROM courses WHERE category_id = ?`).all(id);
      for (const c of courses) {
        await this.delete(c.id);
      }
    } catch (e) {}

    // 3. Delete category row
    await db.prepare(`DELETE FROM categories WHERE id = ?`).run(id);
  },

  async stats() {
    const totalCourses = (await db.prepare(`SELECT COUNT(*) as c FROM courses WHERE status='published'`).get()).c;
    const totalStudents = (await db.prepare(`SELECT COUNT(*) as c FROM users WHERE role='student'`).get()).c;
    const totalInstructors = (await db.prepare(`SELECT COUNT(*) as c FROM users WHERE role='instructor'`).get()).c;
    const totalEnrollments = (await db.prepare(`SELECT COUNT(*) as c FROM enrollments`).get()).c;
    return {
      totalCourses: Number(totalCourses),
      totalStudents: Number(totalStudents),
      totalInstructors: Number(totalInstructors),
      totalEnrollments: Number(totalEnrollments)
    };
  }
};

module.exports = Course;

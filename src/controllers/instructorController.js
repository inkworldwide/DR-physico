const Course = require('../models/Course');
const Curriculum = require('../models/Curriculum');
const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment');
const db = require('../db/connection');

function slugify(text) {
  return (text || 'course')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.dashboard = async (req, res) => {
  const instructorId = req.session.user.id;
  let courses = [];
  if (req.session.user && req.session.user.role === 'admin') {
    courses = await Course.all();
  } else {
    courses = (await Course.byInstructor(instructorId)) || [];
  }
  const totalStudentsRow = await db.prepare(`
    SELECT COUNT(DISTINCT e.user_id) as c FROM enrollments e
    JOIN courses c ON e.course_id = c.id WHERE c.instructor_id = ?
  `).get(instructorId);
  const totalStudents = Number(totalStudentsRow ? totalStudentsRow.c : 0);

  const totalRevenueRow = await db.prepare(`
    SELECT COALESCE(SUM(o.amount), 0) as total FROM orders o
    JOIN courses c ON o.course_id = c.id WHERE c.instructor_id = ? AND o.status = 'success'
  `).get(instructorId);
  const totalRevenue = Number(totalRevenueRow ? totalRevenueRow.total : 0);

  const avgRatingRow = await db.prepare(`
    SELECT AVG(rating_avg) as a FROM courses WHERE instructor_id = ? AND rating_count > 0
  `).get(instructorId);
  const avgRating = Number(avgRatingRow ? avgRatingRow.a : 0) || 0;
  const recentEnrollments = await Enrollment.recentForInstructor(instructorId, 8);

  const instructorNotes = await db.prepare(`
    SELECT n.*, c.name as category_name, crs.title as course_title
    FROM notes n
    LEFT JOIN categories c ON n.category_id = c.id
    LEFT JOIN courses crs ON n.course_id = crs.id
    WHERE n.created_by = ? OR crs.instructor_id = ?
    ORDER BY n.created_at DESC
  `).all(instructorId, instructorId);

  res.render('instructor/dashboard', {
    title: 'Instructor Dashboard', layout: 'layouts/admin',
    courses, totalStudents, totalRevenue, avgRating: avgRating.toFixed(1), recentEnrollments, instructorNotes
  });
};

exports.courseList = async (req, res) => {
  const instructorId = req.session.user.id;
  let courses = [];
  if (req.session.user && req.session.user.role === 'admin') {
    courses = await Course.all();
  } else {
    courses = (await Course.byInstructor(instructorId)) || [];
  }
  const instructorNotes = await db.prepare(`
    SELECT n.*, c.name as category_name, crs.title as course_title
    FROM notes n
    LEFT JOIN categories c ON n.category_id = c.id
    LEFT JOIN courses crs ON n.course_id = crs.id
    WHERE n.created_by = ? OR crs.instructor_id = ?
    ORDER BY n.created_at DESC
  `).all(instructorId, instructorId);

  res.render('instructor/courses', { title: 'My Courses & Notes', layout: 'layouts/admin', courses, instructorNotes });
};

exports.newCourseForm = async (req, res) => {
  res.redirect('/instructor/courses/wizard');
};

exports.createCourse = async (req, res) => {
  const data = req.body;
  const course = await Course.create({
    title: data.title, subtitle: data.subtitle, description: data.description,
    thumbnail: data.thumbnail || '/images/courses/default-course.jpg',
    category_id: data.category_id || null, instructor_id: req.session.user.id,
    level: data.level, language: data.language || 'English',
    price: parseFloat(data.price) || 0, discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
    duration_hours: parseFloat(data.duration_hours) || 0, target_exam: data.target_exam,
    status: data.status || 'draft', requirements: data.requirements, learning_outcomes: data.learning_outcomes
  });
  req.flash('success', 'Course created! Now add modules and lessons.');
  res.redirect(`/instructor/courses/${course.id}/edit`);
};

exports.courseWizardView = async (req, res) => {
  const categories = await Course.categories();
  let course = null;
  let modules = [];
  let quizzes = [];
  let notes = [];
  if (req.query.courseId) {
    course = await Course.findById(req.query.courseId);
    if (course) {
      modules = await Course.getModulesWithLessons(course.id);
      quizzes = await Quiz.byCourse(course.id);
      notes = await db.prepare(`
        SELECT n.*, c.name as category_name 
        FROM notes n 
        LEFT JOIN categories c ON n.category_id = c.id 
        WHERE n.course_id = ? OR (n.course_id IS NULL AND n.category_id = ?) 
        ORDER BY n.position ASC, n.id ASC
      `).all(course.id, course.category_id);
    }
  }
  const selectedCategoryId = req.query.categoryId ? parseInt(req.query.categoryId, 10) : (course ? course.category_id : null);
  const selectedCategory = selectedCategoryId ? categories.find(c => c.id === selectedCategoryId) : null;

  res.render('instructor/course-wizard', {
    title: course ? 'Edit Course Wizard' : 'Create Course Wizard',
    layout: 'layouts/admin',
    categories,
    course,
    modules,
    quizzes,
    notes,
    selectedCategoryId,
    selectedCategory,
    step: parseInt(req.query.step || 1, 10)
  });
};

exports.saveCourseWizard = async (req, res) => {
  try {
    const data = req.body;
    let courseId = data.course_id;

    // Map uploaded files by fieldname
    const uploadedFiles = {};
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(f => {
        uploadedFiles[f.fieldname] = f.filename;
      });
    }

    let thumbnail = data.thumbnail || '/images/courses/course-placeholder.jpg';
    if (uploadedFiles['thumbnail_file']) {
      thumbnail = `/uploads/courses/${uploadedFiles['thumbnail_file']}`;
    }

    const courseType = data.course_type || 'video_hybrid';
    const activeFeatures = data.active_features || JSON.stringify(["1", "6"]);
    let existing = null;
    if (courseId) {
      existing = await Course.findById(courseId);
    }

    if (!courseId) {
      const slug = slugify(data.title || 'course') + '-' + Date.now().toString().slice(-4);
      const info = await db.prepare(`
        INSERT INTO courses (instructor_id, category_id, title, slug, subtitle, description, level, duration_hours, target_exam, status, learning_outcomes, requirements, thumbnail, course_type, price, language, active_features)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'English', ?) RETURNING id
      `).run(
        req.session.user.id,
        data.category_id || 1,
        data.title || 'Untitled Course',
        slug,
        data.subtitle || '',
        data.description || '',
        data.level || 'Beginner',
        parseFloat(data.duration_hours) || 12,
        data.target_exam || 'BPT 1st Year',
        data.is_publish === '1' ? 'published' : 'draft',
        data.learning_outcomes || '',
        data.requirements || '',
        thumbnail,
        courseType,
        activeFeatures
      );
      courseId = info.lastInsertRowid;
    } else {
      if (existing) {
        let finalThumbnail = existing.thumbnail || '/images/courses/course-placeholder.jpg';
        if (uploadedFiles['thumbnail_file']) {
          finalThumbnail = `/uploads/courses/${uploadedFiles['thumbnail_file']}`;
        } else if (data.thumbnail) {
          finalThumbnail = data.thumbnail;
        }

        await db.prepare(`
          UPDATE courses
          SET title = ?, subtitle = ?, description = ?, category_id = ?, level = ?, duration_hours = ?, target_exam = ?, status = ?, requirements = ?, learning_outcomes = ?, course_type = ?, thumbnail = ?, active_features = ?
          WHERE id = ?
        `).run(
          data.title || existing.title,
          data.subtitle !== undefined ? data.subtitle : existing.subtitle,
          data.description !== undefined ? data.description : existing.description,
          data.category_id || existing.category_id,
          data.level || existing.level,
          parseFloat(data.duration_hours) || existing.duration_hours || 12,
          data.target_exam || existing.target_exam,
          data.is_publish === '1' ? 'published' : (data.is_publish === '0' ? 'draft' : existing.status),
          data.requirements !== undefined ? data.requirements : existing.requirements,
          data.learning_outcomes !== undefined ? data.learning_outcomes : existing.learning_outcomes,
          courseType,
          finalThumbnail,
          activeFeatures,
          courseId
        );
      }
    }

    const categoryIdToUpdate = data.category_id || (existing ? existing.category_id : null);
    if (categoryIdToUpdate) {
      await db.prepare(`UPDATE categories SET active_features = ? WHERE id = ?`).run(activeFeatures, categoryIdToUpdate);
    }

    // Determine target module ID (existing module OR newly created module)
    let targetModuleId = data.existing_module_id ? parseInt(data.existing_module_id, 10) : null;
    if (data.module_title) {
      targetModuleId = await Curriculum.addModule(courseId, data.module_title);
    }

    // Process multiple lessons under the target module
    if (targetModuleId) {
      const lessonTitles = Array.isArray(data.lesson_title) ? data.lesson_title : (data.lesson_title ? [data.lesson_title] : []);
      const lessonDurations = Array.isArray(data.duration_minutes) ? data.duration_minutes : (data.duration_minutes ? [data.duration_minutes] : []);
      const lessonUrls = Array.isArray(data.video_url) ? data.video_url : (data.video_url ? [data.video_url] : []);
      const lessonNotes = Array.isArray(data.lesson_notes) ? data.lesson_notes : (data.lesson_notes ? [data.lesson_notes] : []);

      for (let i = 0; i < lessonTitles.length; i++) {
        const title = lessonTitles[i];
        if (!title || !title.trim()) continue;

        let videoUrl = lessonUrls[i] || `/videos/stream/anat-m1-l${i + 1}`;
        if (uploadedFiles[`video_file_${i}`]) {
          videoUrl = `/uploads/lessons/${uploadedFiles[`video_file_${i}`]}`;
        } else if (i === 0 && uploadedFiles['video_file']) {
          videoUrl = `/uploads/lessons/${uploadedFiles['video_file']}`;
        }

        let pdfUrl = '';
        if (uploadedFiles[`pdf_file_${i}`]) {
          pdfUrl = `/uploads/notes/${uploadedFiles[`pdf_file_${i}`]}`;
        } else if (i === 0 && uploadedFiles['pdf_file']) {
          pdfUrl = `/uploads/notes/${uploadedFiles['pdf_file']}`;
        } else if (Array.isArray(data.pdf_url) && data.pdf_url[i]) {
          pdfUrl = data.pdf_url[i];
        } else if (data.pdf_url && typeof data.pdf_url === 'string') {
          pdfUrl = data.pdf_url;
        }

        const duration = parseInt(lessonDurations[i] || 15, 10);
        let notes = lessonNotes[i] || '';
        if (pdfUrl) {
          notes = notes ? `${notes}\n\n[PDF_DOCUMENT:${pdfUrl}]` : `[PDF_DOCUMENT:${pdfUrl}]`;
        }

        await Curriculum.addLesson(targetModuleId, courseId, {
          title,
          type: 'video',
          content: notes,
          video_url: videoUrl,
          duration_minutes: duration,
          is_preview: 0
        });
      }
    }

    // Process Card 6 / Card 8: Study Notes & Document Uploads with Auto-Extraction
    const targetCategoryId = parseInt(data.category_id, 10) || (existing ? existing.category_id : 198);
    const noteFiles = (req.files || []).filter(f =>
      f.fieldname.startsWith('note_file') ||
      f.fieldname.startsWith('doc_file') ||
      f.fieldname.startsWith('pdf_file')
    );

    const noteIds = Array.isArray(data.note_id) ? data.note_id : (data.note_id ? [data.note_id] : []);
    const noteTitles = Array.isArray(data.note_title) ? data.note_title : (data.note_title ? [data.note_title] : []);
    const noteUrls = Array.isArray(data.note_url) ? data.note_url : (data.note_url ? [data.note_url] : []);
    const noteContents = Array.isArray(data.note_content) ? data.note_content : (data.note_content ? [data.note_content] : []);

    const totalNotesToProcess = Math.max(noteIds.length, noteTitles.length, noteFiles.length, noteUrls.length);

    if (totalNotesToProcess > 0 || noteFiles.length > 0) {
      try {
        const documentParser = require('../services/documentParser');
        const { Notes } = require('../models/Content');

        let yearNum = 1;
        if (data.target_exam && data.target_exam.includes('2')) yearNum = 2;
        else if (data.target_exam && data.target_exam.includes('3')) yearNum = 3;
        else if (data.target_exam && data.target_exam.includes('4')) yearNum = 4;

        // Map uploaded files by field name and handle multi-file uploads
        const filesByField = {};
        const unassignedFiles = [];
        noteFiles.forEach(f => {
          if (!filesByField[f.fieldname]) filesByField[f.fieldname] = [];
          filesByField[f.fieldname].push(f);
        });

        const maxLoop = Math.max(totalNotesToProcess, noteFiles.length);
        for (let i = 0; i < maxLoop; i++) {
          let noteId = noteIds[i] ? parseInt(noteIds[i], 10) : null;
          let rawUrl = noteUrls[i] || '';
          let fileUrl = (rawUrl && rawUrl !== '/images/logo-icon.png') ? rawUrl : '';
          
          let fieldFiles = filesByField[`note_file_${i}`] || filesByField[`doc_file_${i}`] || filesByField[`pdf_file_${i}`] || [];

          let title = (noteTitles[i] || '').trim();
          let content = (noteContents[i] || '').trim();

          if (fieldFiles.length > 0) {
            for (let fIdx = 0; fIdx < fieldFiles.length; fIdx++) {
              const fileObj = fieldFiles[fIdx];
              const fileName = fileObj.filename;
              const fUrl = `/uploads/notes/${fileName}`;
              const filePath = fileObj.path || path.join(__dirname, '..', '..', 'public', 'uploads', 'notes', fileName);

              let itemTitle = title;
              let itemContent = content;

              const ext = (fileName.split('.').pop() || '').toLowerCase();
              const isImg = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext);

              const rawName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
              if (fIdx > 0 || !itemTitle || /^page\s*[-:#.]?\s*\d+/i.test((itemTitle || '').trim())) {
                itemTitle = fIdx > 0 ? `${title || 'Text Image / Diagram'} (${fIdx + 1})` : rawName;
              }

              if (isImg && !itemContent.includes('[INTERACTIVE_MODULE:TEXT_IMAGE]')) {
                itemContent = itemContent ? `[INTERACTIVE_MODULE:TEXT_IMAGE]\n${itemContent}` : '[INTERACTIVE_MODULE:TEXT_IMAGE]\nInteractive text image & diagram.';
              }

              if (fIdx === 0 && noteId) {
                await db.prepare(`
                  UPDATE notes 
                  SET title = ?, content = ?, file_url = ?, category_id = ?, course_id = ?
                  WHERE id = ?
                `).run(itemTitle || 'Uploaded Study Note', itemContent || '', fUrl, targetCategoryId, courseId, noteId);
              } else {
                await Notes.create({
                  category_id: targetCategoryId,
                  course_id: courseId,
                  title: itemTitle || 'Uploaded Study Note',
                  content: itemContent || '',
                  file_url: fUrl,
                  year: yearNum,
                  created_by: req.session.user.id
                });
              }
            }
          } else {
            if (!title && !fileUrl) continue;
            let finalNoteTitle = (title || '').trim();
            if (!finalNoteTitle || /^page\s*[-:#.]?\s*\d+/i.test(finalNoteTitle)) {
              if (fileUrl) {
                const baseName = fileUrl.split('/').pop().replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
                finalNoteTitle = baseName || 'Uploaded Study Note';
              } else {
                finalNoteTitle = 'Uploaded Study Note';
              }
            }

            if (noteId) {
              await db.prepare(`
                UPDATE notes 
                SET title = ?, content = ?, file_url = CASE WHEN file_url = '/images/logo-icon.png' THEN NULL ELSE file_url END, category_id = ?, course_id = ?
                WHERE id = ?
              `).run(finalNoteTitle, content || '', targetCategoryId, courseId, noteId);
            } else if (fileUrl) {
              await Notes.create({
                category_id: targetCategoryId,
                course_id: courseId,
                title: finalNoteTitle,
                content: content || '',
                file_url: fileUrl,
                year: yearNum,
                created_by: req.session.user.id
              });
            }
          }
        }
      } catch (notesErr) {
        console.error('Error saving Card 6/8 notes:', notesErr);
      }
    }

    if (data.is_publish === '1') {
      req.flash('success', '🎉 Course Published Successfully with Multiple Video Lessons & Interactive Features!');
      return res.redirect('/instructor/courses');
    }

    req.flash('success', '💾 Course & Video Lessons Saved Successfully!');
    res.redirect(`/instructor/courses/wizard?courseId=${courseId}`);
  } catch (err) {
    console.error('Save Course Wizard Error:', err);
    req.flash('error', `Could not save course data: ${err.message || 'Please check your inputs and try again.'}`);
    res.redirect('/instructor/courses');
  }
};

exports.publishCourseToggle = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    req.flash('error', 'Course not found.');
    return res.redirect('/instructor/courses');
  }
  const newStatus = course.status === 'published' ? 'draft' : 'published';
  await db.prepare('UPDATE courses SET status = ? WHERE id = ?').run(newStatus, course.id);
  req.flash('success', `Course status updated to ${newStatus.toUpperCase()}!`);
  res.redirect('/instructor/courses');
};

exports.editCourseForm = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course || (course.instructor_id !== req.session.user.id && req.session.user.role !== 'admin')) {
    req.flash('error', 'Course not found or access denied.');
    return res.redirect('/instructor/courses');
  }
  const categories = await Course.categories();
  const modules = await Course.getModulesWithLessons(course.id);
  const quizzes = await Quiz.byCourse(course.id);
  res.render('instructor/course-form', { title: 'Edit Course', layout: 'layouts/admin', categories, course, modules, quizzes });
};

exports.updateCourse = async (req, res) => {
  const data = req.body;
  const course = await Course.findById(req.params.id);
  if (!course || (course.instructor_id !== req.session.user.id && req.session.user.role !== 'admin')) {
    req.flash('error', 'Access denied.');
    return res.redirect('/instructor/courses');
  }
  await Course.update(req.params.id, {
    title: data.title, subtitle: data.subtitle, description: data.description,
    category_id: data.category_id || null, level: data.level, language: data.language || 'English',
    price: parseFloat(data.price) || 0, discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
    duration_hours: parseFloat(data.duration_hours) || 0, target_exam: data.target_exam,
    status: data.status, requirements: data.requirements, learning_outcomes: data.learning_outcomes,
    thumbnail: data.thumbnail || null
  });
  req.flash('success', 'Course updated successfully.');
  res.redirect(`/instructor/courses/${req.params.id}/edit`);
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || (course.instructor_id !== req.session.user.id && req.session.user.role !== 'admin')) {
      req.flash('error', 'Access denied.');
      return res.redirect('/instructor/courses');
    }
    await Course.delete(req.params.id);
    req.flash('success', 'Course and all associated notes & materials deleted permanently.');
  } catch (err) {
    console.error('Delete Course Error:', err);
    req.flash('error', 'Could not delete course.');
  }
  res.redirect('/instructor/courses');
};

// ----- Modules & Lessons -----
exports.addModule = async (req, res) => {
  await Curriculum.addModule(req.params.courseId, req.body.title);
  req.flash('success', 'Module added.');
  res.redirect(`/instructor/courses/${req.params.courseId}/edit`);
};

exports.deleteModule = async (req, res) => {
  await Curriculum.deleteModule(req.params.moduleId);
  req.flash('success', 'Module removed.');
  res.redirect(`/instructor/courses/${req.params.courseId}/edit`);
};

exports.addLesson = async (req, res) => {
  const { title, type, video_url, content, duration_minutes, is_preview, quiz_id } = req.body;
  const uploadedVideoUrl = req.file ? `/uploads/lessons/${req.file.filename}` : null;
  await Curriculum.addLesson(req.params.moduleId, req.params.courseId, {
    title, type, video_url: uploadedVideoUrl || video_url, content, duration_minutes: parseInt(duration_minutes) || 10,
    is_preview: is_preview === 'on', quiz_id: quiz_id || null
  });
  req.flash('success', 'Lesson added.');
  res.redirect(`/instructor/courses/${req.params.courseId}/edit`);
};

exports.deleteLesson = async (req, res) => {
  await Curriculum.deleteLesson(req.params.lessonId);
  req.flash('success', 'Lesson removed.');
  res.redirect(`/instructor/courses/${req.params.courseId}/edit`);
};

// ----- Quizzes -----
exports.addQuiz = async (req, res) => {
  const { title, description, time_limit_minutes, pass_percentage } = req.body;
  await Quiz.create({ course_id: req.params.courseId, title, description, time_limit_minutes, pass_percentage });
  req.flash('success', 'Quiz created. Now add questions.');
  res.redirect(`/instructor/courses/${req.params.courseId}/edit`);
};

exports.quizDetail = async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  const questions = await Quiz.getQuestions(req.params.quizId);
  const course = await Course.findById(req.params.courseId);
  res.render('instructor/quiz-detail', { title: 'Manage Quiz', layout: 'layouts/admin', quiz, questions, course });
};

exports.addQuestion = async (req, res) => {
  const { question, option_a, option_b, option_c, option_d, correct_option, explanation } = req.body;
  await Quiz.addQuestion(req.params.quizId, { question, option_a, option_b, option_c, option_d, correct_option, explanation });
  req.flash('success', 'Question added.');
  res.redirect(`/instructor/courses/${req.params.courseId}/quizzes/${req.params.quizId}`);
};

exports.deleteQuestion = async (req, res) => {
  await Quiz.deleteQuestion(req.params.questionId);
  req.flash('success', 'Question removed.');
  res.redirect(`/instructor/courses/${req.params.courseId}/quizzes/${req.params.quizId}`);
};

exports.deleteQuiz = async (req, res) => {
  await Quiz.delete(req.params.quizId);
  req.flash('success', 'Quiz deleted.');
  res.redirect(`/instructor/courses/${req.params.courseId}/edit`);
};

exports.students = async (req, res) => {
  const course = await Course.findById(req.params.id);
  const students = await Enrollment.studentsForCourse(req.params.id);
  res.render('instructor/students', { title: 'Enrolled Students', layout: 'layouts/admin', course, students });
};

exports.profile = (req, res) => {
  res.render('instructor/profile', { title: 'My Profile', layout: 'layouts/admin' });
};

exports.courseDocStudioView = async (req, res) => {
  const categories = await Course.categories();
  const { getSubjectImage } = require('../config/subjectTaxonomy');
  let course = null;
  let modules = [];
  let quizzes = [];
  if (req.query.courseId) {
    course = await Course.findById(req.query.courseId);
    if (course) {
      modules = await Course.getModulesWithLessons(course.id);
      quizzes = await Quiz.byCourse(course.id);
    }
  }
  res.render('instructor/course-doc-studio', {
    title: course ? 'Edit PDF Course' : 'Upload PDF Course Studio',
    layout: 'layouts/admin',
    categories,
    getSubjectImage,
    course,
    modules,
    quizzes
  });
};

exports.parseCourseDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or DOCX file.' });
    }
    const documentParser = require('../services/documentParser');
    const parsedData = await documentParser.parseDocument(req.file.path, req.file.originalname);
    const pdfUrl = `/uploads/notes/${req.file.filename}`;

    const noteId = req.body.note_id ? parseInt(req.body.note_id, 10) : null;
    if (noteId) {
      await db.prepare('UPDATE notes SET file_url = ? WHERE id = ?').run(pdfUrl, noteId);
    }

    res.json({
      success: true,
      pdf_url: pdfUrl,
      data: parsedData
    });
  } catch (err) {
    console.error('Parse Document Error:', err);
    res.status(500).json({ success: false, message: err.message || 'Could not parse uploaded document.' });
  }
};


exports.togglePublishCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const db = require('../db/connection');
    const Course = require('../models/Course');
    const course = await Course.findById(courseId);
    if (course) {
      const newStatus = course.status === 'published' ? 'draft' : 'published';
      await db.prepare('UPDATE courses SET status = ? WHERE id = ?').run(newStatus, courseId);
      req.flash('success', `Course status changed to ${newStatus}.`);
    }
  } catch (err) {
    console.error('Toggle Publish Error:', err);
    req.flash('error', 'Could not update course status.');
  }
  res.redirect('/instructor/courses');
};

exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await db.prepare('SELECT * FROM notes WHERE id = ?').get(noteId);
    const wantsJson = (req.headers.accept && req.headers.accept.includes('application/json')) || req.xhr;
    console.log("deleteNote execution -> noteId:", noteId, "noteFound:", !!note, "wantsJson:", wantsJson);

    if (!note) {
      if (wantsJson) return res.status(404).json({ success: false, message: 'Study note not found.' });
      req.flash('error', 'Study note not found.');
      return res.redirect(req.query.redirect || req.headers.referer || '/instructor/courses');
    }
    if (note.file_url && note.file_url.startsWith('/uploads/notes/')) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', '..', 'public', note.file_url);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    }
    await db.prepare('DELETE FROM notes WHERE id = ?').run(noteId);
    if (wantsJson) return res.json({ success: true, message: 'Study note document deleted permanently.' });
    req.flash('success', 'Study note document deleted permanently.');
  } catch (err) {
    console.error('Delete Note Error:', err);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Could not delete note document.' });
    }
    req.flash('error', 'Could not delete note document.');
  }
  res.redirect(req.query.redirect || req.headers.referer || '/instructor/courses');
};

const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Curriculum = require('../models/Curriculum');
const Quiz = require('../models/Quiz');
const db = require('../db/connection');

exports.dashboard = async (req, res) => {
  // Safety net: /dashboard is the student dashboard route. If a non-student
  // ever lands here (bookmark, stale link, etc.) send them to the right place.
  if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'superadmin')) return res.redirect('/admin/dashboard');
  if (req.session.user && req.session.user.role === 'instructor') return res.redirect('/instructor/dashboard');

  const userId = req.session.user.id;
  const myCourses = await Enrollment.myCourses(userId);
  const stats = await Enrollment.dashboardStats(userId);
  const allAttempts = await Quiz.allAttemptsForUser(userId);
  const recentAttempts = allAttempts.slice(0, 5);
  const certificates = await db.prepare(`
    SELECT cert.*, c.title as course_title, c.slug as course_slug
    FROM certificates cert JOIN courses c ON cert.course_id = c.id
    WHERE cert.user_id = ? ORDER BY cert.issued_at DESC
  `).all(userId);

  res.render('student/dashboard', {
    title: 'My Dashboard',
    myCourses, stats, recentAttempts, certificates
  });
};

exports.myCourses = async (req, res) => {
  const myCourses = await Enrollment.myCourses(req.session.user.id);
  res.render('student/my-courses', { title: 'My Courses', myCourses });
};

exports.learn = async (req, res) => {
  const course = await Course.findBySlug(req.params.slug);
  if (!course) {
    req.flash('error', 'Course not found.');
    return res.redirect('/courses');
  }
  const userId = req.session.user.id;
  const enrollment = await Enrollment.find(userId, course.id);
  if (!enrollment && req.session.user.role === 'student') {
    req.flash('error', 'Please enroll in this course to access the content.');
    return res.redirect(`/courses/${course.slug}`);
  }

  const modules = await Course.getModulesWithLessons(course.id);
  const completedIds = await Enrollment.getCompletedLessonIds(userId, course.id);

  // Determine which lesson to show: ?lesson=ID or first incomplete or first lesson
  let lessonId = req.query.lesson ? parseInt(req.query.lesson) : null;
  let currentLesson = null;

  if (lessonId) {
    currentLesson = await Curriculum.getLesson(lessonId);
  }
  if (!currentLesson) {
    for (const m of modules) {
      const next = m.lessons.find(l => !completedIds.includes(l.id));
      if (next) { currentLesson = next; break; }
    }
    if (!currentLesson && modules[0] && modules[0].lessons[0]) {
      currentLesson = modules[0].lessons[0];
    }
  }

  let quiz = null, questions = [];
  if (currentLesson && currentLesson.type === 'quiz' && currentLesson.quiz_id) {
    quiz = await Quiz.findById(currentLesson.quiz_id);
    questions = await Quiz.getQuestions(currentLesson.quiz_id);
  }

  const context = currentLesson ? await Curriculum.getLessonContext(currentLesson.id) : null;
  const nextLesson = context ? await Curriculum.getNextLesson(course.id, context.position, context.module_position) : null;
  const prevLesson = context ? await Curriculum.getPrevLesson(course.id, context.position, context.module_position) : null;

  res.render('student/learn', {
    title: course.title,
    course, modules, completedIds, currentLesson, quiz, questions,
    nextLesson, prevLesson, enrollment, layout: false
  });
};

exports.markComplete = async (req, res) => {
  const { lessonId, courseId } = req.body;
  const percent = await Enrollment.markLessonComplete(req.session.user.id, lessonId, courseId);
  res.json({ success: true, progress: percent });
};

exports.submitQuiz = async (req, res) => {
  const { quizId, courseSlug, lessonId } = req.body;
  const answers = {};
  Object.keys(req.body).forEach(key => {
    if (key.startsWith('q_')) {
      answers[key.replace('q_', '')] = req.body[key];
    }
  });

  const result = await Quiz.gradeAttempt(parseInt(quizId), req.session.user.id, answers);

  if (result.passed && lessonId) {
    const lesson = await Curriculum.getLesson(lessonId);
    if (lesson) await Enrollment.markLessonComplete(req.session.user.id, lessonId, lesson.course_id);
  }

  res.render('student/quiz-result', {
    title: 'Quiz Results', result, courseSlug, lessonId, layout: false
  });
};

exports.profile = async (req, res) => {
  const User = require('../models/User');
  const profileUser = await User.findById(req.session.user.id);
  res.render('student/profile', { title: 'My Profile', profileUser });
};

exports.updateProfile = async (req, res) => {
  const User = require('../models/User');
  const { name, phone, bio, headline, qualification } = req.body;
  const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;
  const updated = await User.updateProfile(req.session.user.id, { name, phone, bio, headline, qualification, avatar: avatarPath });
  req.session.user = { ...req.session.user, name: updated.name, avatar: updated.avatar };
  req.flash('success', 'Profile updated successfully.');
  const role = req.session.user.role;
  if (role === 'admin') return res.redirect('/admin/profile');
  if (role === 'instructor') return res.redirect('/instructor/profile');
  res.redirect('/profile');
};

exports.changePassword = async (req, res) => {
  const User = require('../models/User');
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.session.user.id);
  const role = req.session.user.role;
  const profilePath = role === 'admin' ? '/admin/profile' : role === 'instructor' ? '/instructor/profile' : '/profile';

  if (!User.verifyPassword(currentPassword, user.password)) {
    req.flash('error', 'Current password is incorrect.');
    return res.redirect(profilePath);
  }
  if (newPassword !== confirmPassword) {
    req.flash('error', 'New passwords do not match.');
    return res.redirect(profilePath);
  }
  if (newPassword.length < 6) {
    req.flash('error', 'New password must be at least 6 characters.');
    return res.redirect(profilePath);
  }
  await User.updatePassword(user.id, newPassword);
  req.flash('success', 'Password changed successfully.');
  res.redirect(profilePath);
};

exports.changeEmail = async (req, res) => {
  const User = require('../models/User');
  const { newEmail, currentPassword } = req.body;
  const user = await User.findById(req.session.user.id);
  const role = req.session.user.role;
  const profilePath = role === 'admin' ? '/admin/profile' : role === 'instructor' ? '/instructor/profile' : '/profile';

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!newEmail || !emailPattern.test(newEmail)) {
    req.flash('error', 'Please enter a valid email address.');
    return res.redirect(profilePath);
  }
  if (!User.verifyPassword(currentPassword || '', user.password)) {
    req.flash('error', 'Current password is incorrect. Email was not changed.');
    return res.redirect(profilePath);
  }
  if (await User.emailTakenByOther(newEmail, user.id)) {
    req.flash('error', 'That email is already in use by another account.');
    return res.redirect(profilePath);
  }
  const updated = await User.updateEmail(user.id, newEmail);
  req.session.user = { ...req.session.user, email: updated.email };
  req.flash('success', 'Email address updated successfully.');
  res.redirect(profilePath);
};

exports.myQuizAttempts = async (req, res) => {
  const attempts = await Quiz.allAttemptsForUser(req.session.user.id);
  res.render('student/quiz-attempts', { title: 'Quiz History', attempts });
};

exports.certificate = async (req, res) => {
  const cert = await db.prepare(`
    SELECT cert.*, c.title as course_title, u.name as student_name
    FROM certificates cert
    JOIN courses c ON cert.course_id = c.id
    JOIN users u ON cert.user_id = u.id
    WHERE cert.certificate_code = ?
  `).get(req.params.code);

  if (!cert) {
    req.flash('error', 'Certificate not found.');
    return res.redirect('/dashboard');
  }
  res.render('student/certificate', { title: 'Certificate', cert, layout: false });
};

exports.generateCertificate = async (req, res) => {
  const userId = req.session.user.id;
  const courseId = req.params.courseId;
  const enrollment = await Enrollment.find(userId, courseId);

  if (!enrollment || enrollment.status !== 'completed') {
    req.flash('error', 'You need to complete the course before generating a certificate.');
    return res.redirect('/dashboard');
  }

  let cert = await db.prepare(`SELECT * FROM certificates WHERE user_id = ? AND course_id = ?`).get(userId, courseId);
  if (!cert) {
    const code = `PE-CERT-${Date.now().toString(36).toUpperCase()}`;
    await db.prepare(`INSERT INTO certificates (user_id, course_id, certificate_code) VALUES (?, ?, ?)`).run(userId, courseId, code);
    cert = await db.prepare(`SELECT * FROM certificates WHERE user_id = ? AND course_id = ?`).get(userId, courseId);
  }
  res.redirect(`/certificate/${cert.certificate_code}`);
};

exports.submitReview = async (req, res) => {
  const { courseId, rating, comment } = req.body;
  const userId = req.session.user.id;
  await db.prepare(`
    INSERT INTO reviews (user_id, course_id, rating, comment) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, course_id) DO UPDATE SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP
  `).run(userId, courseId, rating, comment, rating, comment);

  const agg = await db.prepare(`SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE course_id = ?`).get(courseId);
  await db.prepare(`UPDATE courses SET rating_avg = ?, rating_count = ? WHERE id = ?`).run(agg.avg, agg.cnt, courseId);

  req.flash('success', 'Thank you for your review!');
  const course = await Course.findById(courseId);
  res.redirect(`/courses/${course.slug}`);
};

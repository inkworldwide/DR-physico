const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const { requireAuth, requireRole, requirePermission } = require('../middleware/auth');

router.use(requireAuth, requireRole('instructor', 'admin'));

router.get('/dashboard', instructorController.dashboard);
router.get('/profile', instructorController.profile);

const { uploadLessonVideo, uploadCourseThumbnail, uploadWizardFiles, uploadDocFile } = require('../middleware/upload');

function handleCourseWizardUpload(req, res, next) {
  uploadWizardFiles.any()(req, res, (err) => {
    if (err) {
      req.flash('error', err.message || 'Could not upload files.');
    }
    next();
  });
}

function handleDocFileUpload(req, res, next) {
  uploadDocFile.single('doc_file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Could not upload document file.' });
    }
    next();
  });
}

router.get('/courses', requirePermission('COURSE', 'VIEW'), instructorController.courseList);
router.get('/courses/wizard', requirePermission('COURSE', 'CREATE'), instructorController.courseWizardView);
router.get('/courses/doc-studio', requirePermission('COURSE', 'CREATE'), instructorController.courseDocStudioView);
router.post('/courses/wizard/save', requirePermission('COURSE', 'CREATE'), handleCourseWizardUpload, instructorController.saveCourseWizard);
router.post('/courses/wizard/parse-document', requirePermission('COURSE', 'CREATE'), handleDocFileUpload, instructorController.parseCourseDocument);
router.post('/courses/:id/delete', requirePermission('COURSE', 'DELETE'), instructorController.deleteCourse);
router.post('/courses/:id/publish', requirePermission('COURSE', 'PUBLISH'), instructorController.togglePublishCourse);
router.post('/notes/:id/delete', requirePermission('COURSE', 'DELETE'), instructorController.deleteNote);

function handleLessonVideoUpload(req, res, next) {
  uploadLessonVideo.single('video_file')(req, res, (err) => {
    if (err) {
      req.flash('error', err.message && err.message.includes('File too large')
        ? 'Video is too large. Please choose a file under 200MB.'
        : (err.message || 'Could not upload that video.'));
      return res.redirect(`/instructor/courses/${req.params.courseId}/edit`);
    }
    next();
  });
}

router.post('/courses/:courseId/modules/:moduleId/lessons', requirePermission('COURSE', 'EDIT'), handleLessonVideoUpload, instructorController.addLesson);
router.post('/courses/:courseId/lessons/:lessonId/delete', requirePermission('COURSE', 'EDIT'), instructorController.deleteLesson);

router.post('/courses/:courseId/quizzes', requirePermission('COURSE', 'EDIT'), instructorController.addQuiz);
router.get('/courses/:courseId/quizzes/:quizId', requirePermission('COURSE', 'VIEW'), instructorController.quizDetail);
router.post('/courses/:courseId/quizzes/:quizId/questions', requirePermission('COURSE', 'EDIT'), instructorController.addQuestion);
router.post('/courses/:courseId/quizzes/:quizId/questions/:questionId/delete', requirePermission('COURSE', 'EDIT'), instructorController.deleteQuestion);
router.post('/courses/:courseId/quizzes/:quizId/delete', requirePermission('COURSE', 'EDIT'), instructorController.deleteQuiz);

module.exports = router;


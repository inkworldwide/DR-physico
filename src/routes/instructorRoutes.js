const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const { requireAuth, requireRole } = require('../middleware/auth');

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

router.get('/courses', instructorController.courseList);
router.get('/courses/wizard', instructorController.courseWizardView);
router.get('/courses/doc-studio', instructorController.courseDocStudioView);
router.post('/courses/wizard/save', handleCourseWizardUpload, instructorController.saveCourseWizard);
router.post('/courses/wizard/parse-document', handleDocFileUpload, instructorController.parseCourseDocument);
router.post('/courses/:id/delete', instructorController.deleteCourse);
router.post('/courses/:id/publish', instructorController.togglePublishCourse);
router.post('/notes/:id/delete', instructorController.deleteNote);

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

router.post('/courses/:courseId/modules/:moduleId/lessons', handleLessonVideoUpload, instructorController.addLesson);
router.post('/courses/:courseId/lessons/:lessonId/delete', instructorController.deleteLesson);

router.post('/courses/:courseId/quizzes', instructorController.addQuiz);
router.get('/courses/:courseId/quizzes/:quizId', instructorController.quizDetail);
router.post('/courses/:courseId/quizzes/:quizId/questions', instructorController.addQuestion);
router.post('/courses/:courseId/quizzes/:quizId/questions/:questionId/delete', instructorController.deleteQuestion);
router.post('/courses/:courseId/quizzes/:quizId/delete', instructorController.deleteQuiz);

module.exports = router;

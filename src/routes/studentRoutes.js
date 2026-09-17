const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const enrollmentController = require('../controllers/enrollmentController');
const attendanceController = require('../controllers/attendanceController');
const { requireAuth } = require('../middleware/auth');

const { uploadAvatar } = require('../middleware/upload');

function handleAvatarUpload(req, res, next) {
  uploadAvatar.single('avatar')(req, res, (err) => {
    if (err) {
      req.flash('error', err.message && err.message.includes('File too large')
        ? 'Image is too large. Please choose a file under 3MB.'
        : (err.message || 'Could not upload that image.'));
      return res.redirect('/profile');
    }
    next();
  });
}

router.use(requireAuth);

router.get('/dashboard', studentController.dashboard);
router.get('/my-courses', studentController.myCourses);
router.get('/profile', studentController.profile);
router.post('/profile', handleAvatarUpload, studentController.updateProfile);
router.post('/profile/password', studentController.changePassword);
router.post('/profile/email', studentController.changeEmail);
router.get('/my-quiz-attempts', studentController.myQuizAttempts);

router.get('/courses/:slug/learn', studentController.learn);
router.get('/learn/:slug', studentController.learn);
router.post('/lessons/complete', studentController.markComplete);
router.post('/quiz/submit', studentController.submitQuiz);
router.post('/reviews', studentController.submitReview);

router.get('/checkout/:id', enrollmentController.checkout);
router.post('/checkout/:id/verify', enrollmentController.verifyAndEnroll);
router.post('/enroll/:id/free', enrollmentController.freeEnroll);

router.get('/certificate/:code', studentController.certificate);
router.post('/certificate/generate/:courseId', studentController.generateCertificate);

router.get('/attendance/:courseId', attendanceController.attendancePage);
router.post('/attendance/register-face', attendanceController.registerFace);
router.post('/attendance/verify', attendanceController.verifyAndMark);
router.get('/my-attendance', attendanceController.myAttendance);

module.exports = router;

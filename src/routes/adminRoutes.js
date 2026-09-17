const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { uploadDocFile, uploadCourseThumbnail } = require('../middleware/upload');

router.use(requireAuth, requireRole('admin'));

router.get('/dashboard', adminController.dashboard);
router.get('/profile', adminController.profile);

// Hero Section Management
const handleHeroImageUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    uploadCourseThumbnail.single('hero_image')(req, res, (err) => {
      if (err) {
        console.warn("Hero image upload notice:", err.message);
      }
      next();
    });
  } else {
    next();
  }
};

router.get('/hero', adminController.heroSectionIndex);
router.post('/hero', handleHeroImageUpload, adminController.updateHeroSection);

router.get('/courses', adminController.courses);
router.post('/courses/:id/toggle-featured', adminController.toggleFeatured);
router.post('/courses/:id/toggle-status', adminController.toggleStatus);
router.post('/courses/:id/delete', adminController.deleteCourse);
router.post('/courses/:id/restore', adminController.restoreCourse);
router.post('/courses/:id/permanent-delete', adminController.permanentDeleteCourse);

router.get('/users', adminController.users);
router.post('/users', adminController.createUser);
router.post('/users/create', adminController.createUser);
router.get('/users/:id', adminController.userDetail);
router.post('/users/:id/edit', adminController.updateUser);
router.post('/users/:id/update', adminController.updateUser);
router.post('/users/:id/toggle-active', adminController.toggleUserActive);
router.post('/users/:id/delete', adminController.deleteUser);
router.post('/users/:id/restore', adminController.restoreUser);
router.post('/users/:id/permanent-delete', adminController.permanentDeleteUser);
router.post('/users/:id/reset-password', adminController.resetUserPassword);
router.post('/users/:id/send-sms-reminder', adminController.sendStudentSmsReminder);
router.post('/users/:id/extend-enrollment', adminController.extendStudentEnrollment);
router.post('/users/:id/enroll', adminController.enrollStudent);

router.get('/categories', adminController.categories);
router.get('/categories/:id/courses', adminController.subjectCourses);
router.get('/categories/:id', adminController.subjectCourses);
router.post('/categories', adminController.addCategory);
router.post('/categories/:id/edit', adminController.updateCategory);
router.post('/categories/:id/update', adminController.updateCategory);
router.post('/categories/:id/delete', adminController.deleteCategory);
router.post('/categories/:id/restore', adminController.restoreCategory);
router.post('/categories/:id/permanent-delete', adminController.permanentDeleteCategory);

router.get('/orders', adminController.orders);
router.post('/orders/:id/delete', adminController.deleteOrder);
router.post('/orders/:id/restore', adminController.restoreOrder);
router.post('/orders/:id/permanent-delete', adminController.permanentDeleteOrder);

router.get('/features', adminController.heroFeaturesIndex);
router.post('/features', adminController.addHeroFeature);
router.get('/features/:id/edit', adminController.editHeroFeature);
router.post('/features/:id/update', adminController.updateHeroFeature);
router.post('/features/:id/delete', adminController.deleteHeroFeature);

// Curriculum Section & Cards Management
router.get('/curriculum', adminController.curriculumIndex);
router.post('/curriculum/settings', adminController.updateCurriculumSettings);
router.post('/curriculum/cards', adminController.addCurriculumCard);
router.post('/curriculum/cards/:id/update', adminController.updateCurriculumCard);
router.post('/curriculum/cards/:id/delete', adminController.deleteCurriculumCard);
router.post('/curriculum/cards/:id/move-up', adminController.moveUpCurriculumCard);
router.post('/curriculum/cards/:id/move-down', adminController.moveDownCurriculumCard);

// Learning Journey Section & Cards Management
router.get('/learning-journey', adminController.learningJourneyIndex);
router.post('/learning-journey/settings', adminController.updateLearningJourneySettings);
router.post('/learning-journey/cards', adminController.addLearningJourneyCard);
router.post('/learning-journey/cards/:id/update', adminController.updateLearningJourneyCard);
router.post('/learning-journey/cards/:id/delete', adminController.deleteLearningJourneyCard);
router.post('/learning-journey/cards/:id/move-up', adminController.moveUpLearningJourneyCard);
router.post('/learning-journey/cards/:id/move-down', adminController.moveDownLearningJourneyCard);

// Homepage Sections Position Order Management
router.get('/homepage-sections', adminController.homepageSectionsIndex);
router.post('/homepage-sections/:id/update', adminController.updateHomepageSection);
router.post('/homepage-sections/:id/toggle', adminController.toggleHomepageSection);
router.post('/homepage-sections/:id/move-up', adminController.moveUpHomepageSection);
router.post('/homepage-sections/:id/move-down', adminController.moveDownHomepageSection);

router.get('/vision-mission', adminController.visionMissionIndex);
router.post('/vision-mission', adminController.updateVisionMission);

// Call to Action Banner Manager
router.get('/cta', adminController.ctaIndex);
router.post('/cta', adminController.updateCta);

const handleNoteUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    uploadDocFile.single('note_file')(req, res, (err) => {
      if (err) {
        console.warn("File upload notice:", err.message);
      }
      next();
    });
  } else {
    next();
  }
};

router.get('/notes', adminController.notesIndex);
router.post('/notes', handleNoteUpload, adminController.createNote);
router.post('/notes/:id/delete', adminController.deleteNote);

router.get('/specialties', adminController.specialtiesIndex);
router.post('/specialties', adminController.addSpecialty);
router.get('/specialties/:id/edit', adminController.editSpecialty);
router.post('/specialties/:id/update', adminController.updateSpecialty);
router.post('/specialties/:id/toggle', adminController.toggleSpecialty);
router.post('/specialties/:id/delete', adminController.deleteSpecialty);

router.get('/team', adminController.teamIndex);
router.get('/team/new', adminController.newTeamMember);
router.post('/team/toggle-groups', adminController.toggleTeamGroups);
router.post('/team', adminController.addTeamMember);
router.get('/team/:id/edit', adminController.editTeamMember);
router.post('/team/:id/update', adminController.updateTeamMember);
router.get('/team/:id/toggle-about', adminController.toggleAboutShow);
router.post('/team/:id/toggle-about', adminController.toggleAboutShow);
router.get('/team/:id/toggle-active', adminController.toggleTeamMemberActive);
router.post('/team/:id/toggle-active', adminController.toggleTeamMemberActive);
router.post('/team/:id/reorder', adminController.reorderTeamMember);
router.post('/team/:id/delete', adminController.deleteTeamMember);

router.get('/blog', adminController.blogIndex);
router.post('/blog', adminController.addBlogPost);
router.post('/blog/:id/delete', adminController.deleteBlogPost);

router.get('/live-sessions', adminController.liveSessionsIndex);
router.post('/live-sessions', adminController.createLiveSession);
router.post('/live-sessions/:id/delete', adminController.deleteLiveSession);
router.post('/live-sessions/:id/notify', adminController.notifyRegistrants);

router.get('/appointments', adminController.appointmentsIndex);
router.post('/appointments/:id/status', adminController.updateAppointmentStatus);

// Learning Modules & Question Bank Management
router.get('/learning-modules', adminController.learningModulesIndex);
router.get('/learning-modules/new', adminController.newLearningModuleQuestion);
router.post('/learning-modules', handleNoteUpload, adminController.createLearningModuleQuestion);
router.post('/learning-modules/bulk', adminController.createBulkQuestions);
router.get('/learning-modules/:id/edit', adminController.editLearningModuleQuestion);
router.post('/learning-modules/:id/update', handleNoteUpload, adminController.updateLearningModuleQuestion);
router.post('/learning-modules/:id/toggle', adminController.toggleLearningModuleQuestion);
router.post('/learning-modules/:id/delete', adminController.deleteLearningModuleQuestion);
router.post('/learning-modules/:id/restore', adminController.restoreLearningModuleQuestion);
router.post('/learning-modules/:id/permanent-delete', adminController.permanentDeleteLearningModuleQuestion);

// Document & PDF Uploads
router.post('/learning-modules/upload-doc', handleNoteUpload, adminController.uploadLearningModuleDoc);
router.post('/learning-modules/doc/:id/delete', adminController.deleteLearningModuleDoc);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireGuest } = require('../middleware/auth');

router.get('/login', requireGuest, authController.showLogin);
router.post('/login', authController.login);

// Step 2 — Face verification (after password passes)
router.get('/face-verify', authController.showFaceVerify);
router.post('/face-verify', authController.completeFaceVerify);
router.post('/face-verify/reset', authController.resetFace);
router.post('/face-verify/skip', authController.skipFaceVerify);

// Legacy route (kept for backward compat)
router.post('/face-login', authController.faceLogin);

router.get('/register', requireGuest, authController.showRegister);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

module.exports = router;

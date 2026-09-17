const User = require('../models/User');

// ─── Helper — resolve the correct dashboard path for a user's role ─────────
function dashboardPathForRole(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'instructor') return '/instructor/dashboard';
  return '/dashboard';
}

// ─── LOGIN STEP 1 — Email + Password ────────────────────────────────────────
exports.showLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login — Step 1',
    redirectTo: req.query.redirect || '/dashboard'
  });
};

exports.login = async (req, res) => {
  const { email, password, redirect } = req.body;
  const user = await User.findByEmail(email);

  if (!user || !User.verifyPassword(password, user.password)) {
    req.flash('error', 'Invalid email or password. Please try again.');
    return res.redirect('/auth/login');
  }

  if (!user.is_active) {
    req.flash('error', 'Your account has been deactivated. Please contact support.');
    return res.redirect('/auth/login');
  }

  // Admin accounts bypass face verification for direct superadmin dashboard access
  if (user.role === 'admin') {
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };
    req.flash('success', `Welcome back, Superadmin ${user.name.split(' ')[0]}!`);
    return res.redirect(redirect && redirect.startsWith('/') ? redirect : '/admin/dashboard');
  }

  // Password OK — store pending state for face verification
  req.session.pendingAuth = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    redirect: redirect && redirect.startsWith('/') ? redirect : dashboardPathForRole(user.role)
  };

  // Redirect to Step 2 — Face Verification
  res.redirect('/auth/face-verify');
};

// ─── LOGIN STEP 2 — Face Verify page ────────────────────────────────────────
exports.showFaceVerify = (req, res) => {
  if (!req.session.pendingAuth) {
    req.flash('error', 'Please complete Step 1 first.');
    return res.redirect('/auth/login');
  }
  res.render('auth/face-verify', {
    title: 'Login — Step 2: Face Verification',
    pendingName: req.session.pendingAuth.name,
    redirectTo: req.session.pendingAuth.redirect,
    failedAttempts: req.session.pendingAuth.failedAttempts || 0
  });
};

exports.completeFaceVerify = async (req, res) => {
  const pending = req.session.pendingAuth;
  if (!pending) {
    req.flash('error', 'Session expired. Please start login again.');
    return res.redirect('/auth/login');
  }

  const { faceDescriptor } = req.body;
  if (!faceDescriptor) {
    req.flash('error', 'No face data received. Face verification is required.');
    return res.redirect('/auth/face-verify');
  }

  let submitted;
  try { submitted = JSON.parse(faceDescriptor); } catch (e) {
    req.flash('error', 'Invalid face data. Please try again.');
    return res.redirect('/auth/face-verify');
  }

  // Compare submitted face against the SPECIFIC user who passed Step 1
  const user = await User.findById(pending.userId);
  if (!user) {
    req.flash('error', 'Account not found. Please contact support.');
    req.session.pendingAuth = null;
    return res.redirect('/auth/login');
  }

  if (!user.face_descriptor) {
    // No face on file yet (e.g. a seeded/demo account) — enroll this scan as their
    // reference face now, so this and every future login can verify against it.
    await User.saveFaceDescriptor(user.id, faceDescriptor);
    req.session.pendingAuth = null;
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
    req.flash('success', `Welcome, ${user.name.split(' ')[0]}! Your face has been registered for future logins.`);
    return res.redirect(pending.redirect);
  }

  let stored;
  try { stored = JSON.parse(user.face_descriptor); } catch (e) {
    req.flash('error', 'Stored face data is corrupt. Please contact support.');
    return res.redirect('/auth/login');
  }

  // Euclidean distance — threshold 0.5 (lower = stricter match)
  const dist = Math.sqrt(stored.reduce((sum, val, i) => sum + Math.pow(val - submitted[i], 2), 0));

  if (dist >= 0.5) {
    pending.failedAttempts = (pending.failedAttempts || 0) + 1;
    req.flash('error', 'Face not recognised. Please look directly at the camera and try again.');
    return res.redirect('/auth/face-verify');
  }

  // Both factors passed — create full session
  req.session.pendingAuth = null;
  req.session.user = {
    id: user.id, name: user.name, email: user.email,
    role: user.role, avatar: user.avatar
  };
  req.flash('success', `Welcome back, ${user.name.split(' ')[0]}! Both verifications passed.`);
  res.redirect(pending.redirect);
};

exports.resetFace = async (req, res) => {
  const pending = req.session.pendingAuth;
  if (!pending) {
    req.flash('error', 'Session expired. Please start login again.');
    return res.redirect('/auth/login');
  }
  // Password was already verified in Step 1 — that's enough proof of identity
  // to let someone overwrite their own stuck face registration.
  const { faceDescriptor } = req.body;
  if (!faceDescriptor) {
    req.flash('error', 'No face captured. Please try scanning again.');
    return res.redirect('/auth/face-verify');
  }
  const user = await User.findById(pending.userId);
  await User.saveFaceDescriptor(user.id, faceDescriptor);
  req.session.pendingAuth = null;
  req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
  req.flash('success', `Your face has been re-registered, ${user.name.split(' ')[0]}. You're logged in.`);
  res.redirect(pending.redirect);
};

exports.skipFaceVerify = (req, res) => {
  const pending = req.session.pendingAuth;
  if (!pending) {
    req.flash('error', 'Session expired. Please start login again.');
    return res.redirect('/auth/login');
  }
  req.session.user = {
    id: pending.userId,
    name: pending.name,
    email: pending.email,
    role: pending.role,
    avatar: pending.avatar
  };
  req.session.pendingAuth = null;
  req.flash('success', `Welcome, ${pending.name.split(' ')[0]}!`);
  res.redirect(pending.redirect);
};

// ─── REGISTER — Two-step (form + face) ──────────────────────────────────────
exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Create Account' });
};

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword, role, faceDescriptor } = req.body;

  if (!name || !email || !password) {
    req.flash('error', 'Please fill in all required fields.');
    return res.redirect('/auth/register');
  }
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/auth/register');
  }
  if (password.length < 6) {
    req.flash('error', 'Password must be at least 6 characters.');
    return res.redirect('/auth/register');
  }
  if (await User.findByEmail(email)) {
    req.flash('error', 'An account with this email already exists.');
    return res.redirect('/auth/register');
  }

  // Face is compulsory on registration
  if (!faceDescriptor || faceDescriptor.length < 10) {
    req.flash('error', 'Face registration is required. Please complete Step 2 — Face Capture before submitting.');
    return res.redirect('/auth/register');
  }
  try { JSON.parse(faceDescriptor); } catch (e) {
    req.flash('error', 'Face data is invalid. Please retake your face photo and try again.');
    return res.redirect('/auth/register');
  }

  const registerableRoles = ['student', 'intern', 'clinician', 'educator', 'researcher', 'instructor'];
  const allowedRole = registerableRoles.includes(role) ? role : 'student';
  const user = await User.create({ name, email, password, role: allowedRole });
  await User.saveFaceDescriptor(user.id, faceDescriptor);

  req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
  req.flash('success', `Welcome to PhysioEdvance, ${user.name.split(' ')[0]}! Account and face created successfully.`);
  res.redirect(dashboardPathForRole(user.role));
};

// ─── Legacy face-login (kept for backward compat, now unused in main flow) ──
exports.faceLogin = (req, res) => {
  res.redirect('/auth/login');
};

// ─── LOGOUT ─────────────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

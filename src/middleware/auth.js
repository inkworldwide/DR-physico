const User = require('../models/User');

function attachUser(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path;
  next();
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Please log in to continue.');
    return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
  }
  next();
}

function requireGuest(req, res, next) {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash('error', 'Please log in to continue.');
      return res.redirect('/auth/login');
    }
    if (!roles.includes(req.session.user.role)) {
      req.flash('error', "You don't have permission to access that page.");
      return res.redirect('/dashboard');
    }
    next();
  };
}

// Refresh session user from DB (in case profile updated elsewhere)
async function refreshUser(req, res, next) {
  if (req.session.user) {
    const fresh = await User.findById(req.session.user.id);
    if (fresh) {
      req.session.user = { id: fresh.id, name: fresh.name, email: fresh.email, role: fresh.role, avatar: fresh.avatar };
    } else {
      req.session.destroy(() => {});
    }
  }
  next();
}

module.exports = { attachUser, requireAuth, requireGuest, requireRole, refreshUser };

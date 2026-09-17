const faceClient = require('../services/faceAttendanceClient');
const Attendance = require('../models/Attendance');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.attendancePage = async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    req.flash('error', 'Course not found.');
    return res.redirect('/my-courses');
  }
  if (!(await Enrollment.isEnrolled(req.session.user.id, course.id))) {
    req.flash('error', 'You must be enrolled in this course to mark attendance.');
    return res.redirect(`/courses/${course.slug}`);
  }

  res.render('student/attendance', {
    title: 'Mark Attendance',
    course,
    faceConfigured: faceClient.isFaceServiceConfigured(),
    isRegistered: await Attendance.isFaceRegisteredLocally(req.session.user.id),
    alreadyMarkedToday: await Attendance.hasMarkedToday(req.session.user.id, course.id),
    layout: false
  });
};

exports.registerFace = async (req, res) => {
  const { image } = req.body;
  if (!image) return res.json({ success: false, message: 'No image received.' });

  const result = await faceClient.registerFace(req.session.user.id, image);
  if (result.success) {
    await Attendance.markFaceRegistered(req.session.user.id);
  }
  res.json(result);
};

exports.verifyAndMark = async (req, res) => {
  const { image, courseId, lessonId } = req.body;
  if (!image) return res.json({ success: false, message: 'No image received.' });

  const course = await Course.findById(courseId);
  if (!course || !(await Enrollment.isEnrolled(req.session.user.id, courseId))) {
    return res.status(403).json({ success: false, message: 'Not enrolled in this course.' });
  }

  const result = await faceClient.verifyFace(req.session.user.id, image);

  if (result.success && result.match) {
    await Attendance.recordAttendance({
      userId: req.session.user.id,
      courseId,
      lessonId: lessonId || null,
      method: 'face',
      matchDistance: result.distance
    });
  }

  res.json(result);
};

exports.myAttendance = async (req, res) => {
  const records = await Attendance.forStudent(req.session.user.id);
  res.render('student/attendance-history', { title: 'My Attendance', records });
};

exports.courseAttendance = async (req, res) => {
  const course = await Course.findById(req.params.id);
  const records = await Attendance.forCourse(req.params.id);
  res.render('instructor/attendance', { title: 'Attendance — ' + course.title, layout: 'layouts/admin', course, records });
};

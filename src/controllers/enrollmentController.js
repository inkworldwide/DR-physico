const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const db = require('../db/connection');
const payment = require('../services/paymentService');

exports.checkout = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    req.flash('error', 'Course not found.');
    return res.redirect('/courses');
  }
  if (await Enrollment.isEnrolled(req.session.user.id, course.id)) {
    req.flash('success', "You're already enrolled in this course.");
    return res.redirect(`/courses/${course.slug}/learn`);
  }

  const amount = course.discount_price || course.price;

  // Free course — skip payment entirely.
  if (amount <= 0) {
    return res.render('student/checkout', { title: 'Checkout', course, razorpayOrder: null, paymentConfigured: true });
  }

  if (!payment.isPaymentConfigured()) {
    // No real Razorpay keys yet — show a clear, honest message instead of pretending to charge the card.
    return res.render('student/checkout', { title: 'Checkout', course, razorpayOrder: null, paymentConfigured: false });
  }

  try {
    const razorpayOrder = await payment.createOrder({
      amountInRupees: amount,
      receipt: `course_${course.id}_user_${req.session.user.id}_${Date.now()}`,
      notes: { courseId: String(course.id), userId: String(req.session.user.id), courseTitle: course.title }
    });
    res.render('student/checkout', {
      title: 'Checkout', course, razorpayOrder, paymentConfigured: true,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Razorpay order creation failed:', err.message);
    req.flash('error', 'Could not start payment right now. Please try again in a moment.');
    res.redirect(`/courses/${course.slug}`);
  }
};

/**
 * Called by the Razorpay checkout widget's success callback (client-side JS)
 * after the user completes payment. We re-verify the signature server-side
 * before granting access — never trust the client alone.
 */
exports.verifyAndEnroll = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
  const course = await Course.findById(courseId);
  const userId = req.session.user.id;

  if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

  const isValid = payment.verifySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature
  });

  if (!isValid) {
    console.warn(`Razorpay signature mismatch for user ${userId}, course ${courseId}`);
    return res.status(400).json({ success: false, message: 'Payment verification failed.' });
  }

  const amount = course.discount_price || course.price;

  await db.prepare(`
    INSERT INTO orders (user_id, course_id, amount, payment_method, transaction_id, status)
    VALUES (?, ?, ?, 'razorpay', ?, 'success')
  `).run(userId, course.id, amount, razorpay_payment_id);

  if (!(await Enrollment.isEnrolled(userId, course.id))) {
    await Enrollment.enroll(userId, course.id);
  }

  res.json({ success: true, redirect: `/courses/${course.slug}/learn` });
};

exports.freeEnroll = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    req.flash('error', 'Course not found.');
    return res.redirect('/courses');
  }
  const userId = req.session.user.id;
  if (!(await Enrollment.isEnrolled(userId, course.id))) {
    await Enrollment.enroll(userId, course.id);
    await db.prepare(`
      INSERT INTO orders (user_id, course_id, amount, payment_method, transaction_id, status)
      VALUES (?, ?, 0, 'free', ?, 'success')
    `).run(userId, course.id, `FREE-${Date.now()}-${userId}`);
  }
  req.flash('success', `You're enrolled in "${course.title}"!`);
  res.redirect(`/courses/${course.slug}/learn`);
};

const crypto = require('crypto');

let razorpayInstance = null;
let isConfigured = false;

function getRazorpay() {
  if (razorpayInstance) return razorpayInstance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    isConfigured = false;
    return null;
  }

  const Razorpay = require('razorpay');
  razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  isConfigured = true;
  return razorpayInstance;
}

/**
 * Whether real Razorpay keys are present in the environment.
 * Use this to decide whether to show the real payment button
 * or a "payments not configured yet" message to the instructor/admin.
 */
function isPaymentConfigured() {
  getRazorpay();
  return isConfigured;
}

/**
 * Creates a Razorpay order. Amount must be in paise (₹1 = 100 paise).
 */
async function createOrder({ amountInRupees, receipt, notes }) {
  const rzp = getRazorpay();
  if (!rzp) throw new Error('Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env');

  const order = await rzp.orders.create({
    amount: Math.round(amountInRupees * 100), // paise
    currency: 'INR',
    receipt,
    notes
  });
  return order;
}

/**
 * Verifies the signature Razorpay sends back after a successful checkout,
 * to confirm the payment wasn't tampered with client-side.
 * https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/#5-verify-payment-signature
 */
function verifySignature({ orderId, paymentId, signature }) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expected === signature;
}

module.exports = { getRazorpay, isPaymentConfigured, createOrder, verifySignature };

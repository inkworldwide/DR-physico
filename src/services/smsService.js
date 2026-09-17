/**
 * SMS notifications via MSG91 — a standard Indian SMS gateway (works well
 * alongside Razorpay since both are India-first providers, and MSG91 doesn't
 * require the lengthy international A2P registration some other gateways need
 * for quick setup, though DLT/sender-ID registration is still required by
 * Indian telecom regulation — see README for what you'll need to set up).
 *
 * Setup required (yours to do):
 *   1. Create an account at https://msg91.com
 *   2. Complete DLT registration for your sender ID (required by Indian law for
 *      any business SMS — this is not optional and not something code can skip)
 *   3. Get your Auth Key from the MSG91 dashboard
 *   4. Put it in .env as MSG91_AUTH_KEY, and set MSG91_SENDER_ID (6 chars, DLT-approved)
 */

const db = require('../db/connection');

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || 'PHYEDV';

function isSmsConfigured() {
  return !!MSG91_AUTH_KEY;
}

async function logSms({ userId, phone, message, purpose, status, providerResponse }) {
  await db.prepare(`
    INSERT INTO sms_log (user_id, phone, message, purpose, status, provider_response, sent_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId || null, phone, message, purpose || null, status, providerResponse || null, status === 'sent' ? new Date().toISOString() : null);
}

/**
 * Sends a single SMS via MSG91's v5 API.
 * https://docs.msg91.com/p/tf9GTm84e/e/4u9hWB-MQv/MSG91
 */
async function sendSms({ userId, phone, message, purpose }) {
  if (!isSmsConfigured()) {
    await logSms({ userId, phone, message, purpose, status: 'failed', providerResponse: 'MSG91_AUTH_KEY not configured' });
    return { success: false, message: 'SMS service is not configured on this server.' };
  }

  try {
    const res = await fetch('https://control.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'authkey': MSG91_AUTH_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: MSG91_SENDER_ID,
        // For a one-off plain-text message MSG91 also supports the simpler
        // /api/v5/otp or campaign send endpoints depending on your account
        // setup — adjust this payload to match the flow/template you configure
        // in your MSG91 dashboard. This is wired for the generic flow API.
        short_url: '0',
        mobiles: phone.replace(/\D/g, ''),
        message
      })
    });

    const data = await res.json();
    const success = res.ok && data.type !== 'error';
    await logSms({ userId, phone, message, purpose, status: success ? 'sent' : 'failed', providerResponse: JSON.stringify(data) });
    return { success, raw: data };
  } catch (err) {
    await logSms({ userId, phone, message, purpose, status: 'failed', providerResponse: err.message });
    return { success: false, message: 'Could not reach SMS provider.' };
  }
}

/**
 * Sends the same message to many recipients (e.g. all participants registered
 * for a live session). Sends sequentially with a tiny delay to stay well within
 * typical rate limits — for large lists, queue this as a background job instead.
 */
async function sendBulkSms(recipients, message, purpose) {
  const results = [];
  for (const r of recipients) {
    results.push(await sendSms({ userId: r.userId, phone: r.phone, message, purpose }));
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  return results;
}

module.exports = { isSmsConfigured, sendSms, sendBulkSms };

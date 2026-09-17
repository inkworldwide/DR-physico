/**
 * Zoom integration for Live Classes / Workshops / Webinars / Panel Discussions.
 *
 * Per the proposal: "For live session we will be creating only the topics and
 * share the links, there will be NO live streaming built by us" — meaning this
 * app does not embed a video call; it creates a real Zoom meeting via Zoom's API
 * and stores/shares the real join link Zoom returns.
 *
 * Setup required (yours to do — see README):
 *   1. Create a Zoom App at https://marketplace.zoom.us/ (Server-to-Server OAuth type)
 *   2. Get Account ID, Client ID, Client Secret
 *   3. Put them in .env as ZOOM_ACCOUNT_ID / ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET
 */

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

let cachedToken = null;
let tokenExpiresAt = 0;

function isZoomConfigured() {
  return !!(ZOOM_ACCOUNT_ID && ZOOM_CLIENT_ID && ZOOM_CLIENT_SECRET);
}

/**
 * Server-to-Server OAuth token exchange.
 * https://developers.zoom.us/docs/internal-apps/s2s-oauth/
 */
async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const basicAuth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${basicAuth}` }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoom OAuth failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000; // refresh 1 min early
  return cachedToken;
}

/**
 * Creates a real, scheduled Zoom meeting and returns its real join/start URLs.
 * topic, startTimeISO (e.g. "2026-07-01T10:00:00"), durationMinutes
 */
async function createMeeting({ topic, startTimeISO, durationMinutes = 60, agenda = '' }) {
  if (!isZoomConfigured()) {
    throw new Error('Zoom is not configured. Add ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET to .env');
  }

  const token = await getAccessToken();

  const res = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic,
      type: 2, // scheduled meeting
      start_time: startTimeISO,
      duration: durationMinutes,
      timezone: 'Asia/Kolkata',
      agenda,
      settings: {
        join_before_host: false,
        waiting_room: true,
        approval_type: 0
      }
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoom meeting creation failed: ${res.status} ${text}`);
  }

  const meeting = await res.json();
  return {
    zoomMeetingId: String(meeting.id),
    joinUrl: meeting.join_url,
    startUrl: meeting.start_url
  };
}

async function deleteMeeting(zoomMeetingId) {
  if (!isZoomConfigured()) return false;
  const token = await getAccessToken();
  const res = await fetch(`https://api.zoom.us/v2/meetings/${zoomMeetingId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.ok || res.status === 404;
}

module.exports = { isZoomConfigured, createMeeting, deleteMeeting };

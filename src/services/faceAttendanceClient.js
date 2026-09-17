/**
 * Client for the separate face-auth-service (FastAPI microservice).
 * This is the ONLY place in the Node app that talks to that service —
 * keep all HTTP/multipart details contained here.
 */

const FACE_SERVICE_URL = process.env.FACE_SERVICE_URL || 'http://localhost:8001';
const FACE_SERVICE_SECRET = process.env.FACE_SERVICE_SECRET || '';

function isFaceServiceConfigured() {
  return !!process.env.FACE_SERVICE_URL && !!process.env.FACE_SERVICE_SECRET;
}

/**
 * Sends a base64 data-URL image (e.g. captured from a <canvas>) to the
 * face service for registration or verification.
 * action: 'register' | 'verify'
 */
async function callFaceService(action, userId, base64ImageDataUrl) {
  if (!isFaceServiceConfigured()) {
    return { success: false, error: 'not_configured', message: 'Face attendance service is not configured on this server.' };
  }

  const matches = base64ImageDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) {
    return { success: false, error: 'bad_image', message: 'Invalid image data received from the browser.' };
  }
  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  const form = new FormData();
  form.append('user_id', String(userId));
  const ext = mimeType.split('/')[1] || 'jpg';
  form.append('image', new Blob([buffer], { type: mimeType }), `capture.${ext}`);

  try {
    const res = await fetch(`${FACE_SERVICE_URL}/api/face/${action}`, {
      method: 'POST',
      headers: { 'X-Service-Secret': FACE_SERVICE_SECRET },
      body: form
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: 'service_error', message: data.detail || 'Face service returned an error.' };
    }
    return data;
  } catch (err) {
    console.error('Face service request failed:', err.message);
    return { success: false, error: 'unreachable', message: 'Could not reach the face attendance service. Is it running?' };
  }
}

async function registerFace(userId, base64ImageDataUrl) {
  return callFaceService('register', userId, base64ImageDataUrl);
}

async function verifyFace(userId, base64ImageDataUrl) {
  return callFaceService('verify', userId, base64ImageDataUrl);
}

async function checkFaceStatus(userId) {
  if (!isFaceServiceConfigured()) return { registered: false };
  try {
    const res = await fetch(`${FACE_SERVICE_URL}/api/face/status/${userId}`, {
      headers: { 'X-Service-Secret': FACE_SERVICE_SECRET }
    });
    if (!res.ok) return { registered: false };
    return await res.json();
  } catch {
    return { registered: false };
  }
}

module.exports = { isFaceServiceConfigured, registerFace, verifyFace, checkFaceStatus };

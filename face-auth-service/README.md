# Face Attendance Service

A small, **internal-only** FastAPI microservice that lets students mark course attendance via a face scan instead of (or alongside) manual check-in. This is a separate Python service — it does not replace the main email/password login on Physico Edvance.

## ⚠️ Before you install: a heads-up on `dlib`

`face_recognition` depends on `dlib`, a C++ library. Installing it on Windows requires either:
- **CMake + a C++ compiler** (Visual Studio Build Tools — same kind of install some Node native modules need), or
- A **prebuilt dlib wheel** for your exact Python version (search "dlib whl windows python 3.x" — community-built wheels exist for common versions, but verify the source before trusting it)

**This is a genuinely heavier install than anything else in this project.** If you'd rather avoid it entirely, the alternative is swapping `face_recognition` for a cloud API (Azure Face, AWS Rekognition) — ask if you want that version instead; it needs no local compiling but does cost a small amount per scan and requires your own cloud account.

## Setup

```bash
cd face-auth-service
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

If `dlib` fails to build, the error will look similar to the `node-gyp` errors you saw earlier — it means no C++ compiler was found. Install CMake (https://cmake.org/download/) and Visual Studio Build Tools with "Desktop development with C++", then retry.

```bash
cp .env.example .env
# Edit .env: set FACE_SERVICE_SECRET to a long random string

python -m uvicorn app.main:app --reload --port 8001
```

Health check: http://localhost:8001/health

## Connecting it to Physico Edvance

In the main project's `.env`, add the **same** secret:

```
FACE_SERVICE_URL=http://localhost:8001
FACE_SERVICE_SECRET=<same long random string as above>
```

The Node app calls this service over HTTP using that shared secret — see `src/services/faceAttendanceClient.js` in the main project.

## API

All endpoints (except `/health`) require header `X-Service-Secret: <your secret>`.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/face/register` | Register a student's reference face (`user_id`, `image` form fields) |
| POST | `/api/face/verify` | Compare a new scan against the stored face, returns `match: true/false` |
| GET | `/api/face/status/{user_id}` | Check if a user has a face registered |
| DELETE | `/api/face/{user_id}` | Delete a user's stored face data |

## How matching works

A face is converted into a 128-number vector (an "encoding") — this is **not a photo**, it's a fingerprint-like set of measurements. The actual uploaded photo is never saved to disk; it's processed in memory and discarded immediately. Only the resulting vector is stored, as a `.npy` file named after the user's ID, in `storage/face_encodings/`.

Verification computes the numeric distance between a new scan's vector and the stored one. If the distance is below `FACE_MATCH_TOLERANCE` (default `0.5`), it's accepted as a match.

## ⚖️ Privacy & legal responsibilities (read this)

Face data is **biometric data**, which most privacy laws (India's DPDP Act, GDPR if any EU users, etc.) treat as sensitive personal data requiring explicit, informed consent and extra safeguards. Before using this in production:

- Add a clear **consent screen** before any face is captured, explaining what's stored and why, with an opt-out alternative (manual attendance) — never make face scanning the *only* way to attend a course.
- Add a **delete-my-data** flow students can self-trigger, calling the `DELETE /api/face/{user_id}` endpoint.
- Restrict network access to this service — it should not be reachable from the public internet, only from your Node backend's server.
- Keep `storage/face_encodings/` outside any publicly-served directory and excluded from backups that leave your infrastructure unencrypted.
- This service does **not** implement liveness detection (i.e. it can't tell a live face from a printed photo held up to the camera) — don't use it for anything higher-stakes than convenience attendance tracking without adding that.

This is genuinely your responsibility to get right before going live — I've built the mechanics, but the consent/legal/security wrapping around it is on you (or your institution's compliance process) to finish.

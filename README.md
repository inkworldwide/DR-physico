# 🧑‍⚕️ PhysioEdvance

**One-stop solution for physiotherapy students, focusing on advanced physiotherapy education.**

Built from the original INK Worldwide proposal: an informational website, year-wise subject pages (Year 1–4 + Other Subjects), a digital library (LMS) with video lessons and quizzes, a research desk, blog, live classes with real Zoom integration, SMS notifications, and the founding/advisory/legal team.

---

## ✨ What's included

- **Public site** — homepage (hero, therapy types slider, services, subjects, vision/mission, certified therapists, appointment/callback form, WhatsApp), About, The Team, Blog, Live Sessions, Contact
- **Subjects** — all 33 year-wise subjects (Year 1–4) + 23 "Other Subjects" from the original proposal, each with its own page (courses, notes, research desk articles)
- **Digital Library (LMS)** — student dashboard, lesson player (video/article/quiz), progress tracking, quiz engine with instant grading, printable certificates
- **Live Classes** — real Zoom meeting creation via Zoom's Server-to-Server OAuth API (not a mock), session registration, SMS reminders via MSG91
- **Instructor panel** — course builder grouped by Year/Subject, curriculum (modules → lessons), quiz & question builder, enrolled-student lists
- **Admin panel** — dashboard with charts, manage Subjects/Users/Orders, **and** Team, Blog, Live Sessions, Appointment requests
- **Real payments** — Razorpay checkout (UPI/cards/netbanking), server-side signature verification
- **Face attendance** (optional add-on) — separate microservice, see `face-auth-service/README.md`
- **Real PostgreSQL database** — 24 tables, fully normalized, runs locally on your own machine

## 🛠 Tech Stack

- **Backend:** Node.js + Express
- **Views:** EJS + express-ejs-layouts
- **Database:** PostgreSQL via `pg` (node-postgres)
- **Auth:** express-session + bcryptjs, rate-limited login
- **Payments:** Razorpay
- **Live classes:** Zoom Server-to-Server OAuth API
- **SMS:** MSG91
- **Frontend:** Bootstrap 5 + Remix Icons + Chart.js (CDN, no build step)

## 🚀 Getting Started

### 1. Install PostgreSQL locally (skip if already installed)

- **Windows:** download from https://www.postgresql.org/download/windows/ and run the installer (remember the password you set for the `postgres` user)
- **Mac:** `brew install postgresql@16 && brew services start postgresql@16`
- **Linux:** `sudo apt install postgresql && sudo systemctl start postgresql`

### 2. Create the database

```bash
# Windows: open "SQL Shell (psql)" from the Start Menu, or use pgAdmin's Query Tool
# Mac/Linux:
createdb physioedvance
```

If `createdb` isn't on your PATH, you can instead run this inside `psql`:
```sql
CREATE DATABASE physioedvance;
```

### 3. Configure and run the app

```bash
npm install
cp .env.example .env
```

Open `.env` and set `PGUSER` / `PGPASSWORD` to match your local Postgres login (defaults to `postgres` user with no password, which works for most default local installs).

```bash
npm run seed
npm start
```

`npm run seed` creates all 24 tables (if they don't exist yet) and populates demo data. Re-running it wipes and rebuilds from scratch — skip it on any run where you want to keep data you've since added yourself.

Open **http://localhost:3000**

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@physioedvance.com | Admin@123 |
| Founder | heena.nawaz@physioedvance.com | Instructor@123 |
| Student | aarav.sharma@student.com | Student@123 |

Full list in `src/db/seed.js`. These aren't shown anywhere in the UI — use this table directly.

## 📚 Subject Taxonomy

The canonical list of all subjects (sourced directly from the proposal) lives in `src/config/subjectTaxonomy.js` — this is the single source of truth used by the seed script, subject pages, and course builder dropdowns. Edit that file if the curriculum changes; everything downstream reads from it.

## 💳 Real Payments (Razorpay)

1. Create a free account at https://dashboard.razorpay.com/signup
2. Settings → API Keys → Generate Test Key
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
   ```
4. Restart the server. Checkout will show a real "Pay via Razorpay" button. Without keys, it shows a clear "not configured" notice instead of faking a payment.

## 🎥 Live Classes (Real Zoom Integration)

Per the original proposal: *"For live session we will be creating only the topics and share the links, there will be no live streaming built."* This app creates **real, scheduled Zoom meetings** via Zoom's API and shares the real join link — it does not embed a video call itself.

**Setup:**
1. Go to https://marketplace.zoom.us/ → Develop → Build App → choose **Server-to-Server OAuth**
2. Note the **Account ID**, **Client ID**, **Client Secret**
3. Add scopes: `meeting:write:admin` (or `meeting:write` depending on Zoom's current scope naming — check the app's Scopes tab)
4. Add to `.env`:
   ```
   ZOOM_ACCOUNT_ID=...
   ZOOM_CLIENT_ID=...
   ZOOM_CLIENT_SECRET=...
   ```
5. In the Admin panel → Live Sessions → create a session and check "Create a real Zoom meeting automatically." A real join link is generated and shown to registered students.

Without Zoom configured, you can still create session listings (topic + schedule) — the join link just won't auto-generate; you can paste one in manually if you create the Zoom meeting yourself elsewhere.

## 📱 SMS Notifications (MSG91)

Used to notify live-session registrants. **Important:** Indian telecom regulation (DLT) requires sender-ID registration before you can send any business SMS — this is a real legal/regulatory step, not something code can skip.

1. Create an account at https://msg91.com
2. Complete DLT registration for your sender ID (their dashboard walks you through it)
3. Add to `.env`:
   ```
   MSG91_AUTH_KEY=...
   MSG91_SENDER_ID=PHYEDV
   ```
4. From Admin → Live Sessions, click the SMS icon next to a session to notify all registrants with the real join link.

Without `MSG91_AUTH_KEY` set, the notify button shows a clear "not configured" message — no fake "sent" confirmation.

## 🌐 Subdomains

The proposal calls for `subjects.physioedvance.com` (and a "Core Aspects" area). This single Express app already **detects subdomains** from the request's Host header (`req.subdomain` in `src/app.js`) — visiting `subjects.physioedvance.com/` redirects straight to the subjects index.

**To make this live, you need to do the following at your domain/hosting level (not code):**
1. In your domain's DNS settings, add a CNAME or A record for `subjects` (and `core`, if used) pointing to the same server as your main domain
2. In your hosting/reverse-proxy config (Nginx, Vercel, etc.), make sure both the root domain and the subdomain route to this same Node app
3. No separate deployment needed — the app already responds correctly based on which hostname it receives

## 🔒 Security

- `helmet` security headers (CSP scoped to the CDNs/APIs this app actually uses)
- `express-rate-limit` on login/register (20 attempts / 15 min per IP)
- Session cookies: `httpOnly`, `sameSite: lax`, auto-`secure` when `NODE_ENV=production`
- Passwords hashed with bcrypt
- Razorpay payments verified server-side via HMAC signature

## 🧑‍🎓 Face Attendance (optional add-on)

Separate FastAPI microservice for webcam-based attendance marking — see `face-auth-service/README.md` for setup and **important privacy/consent obligations** before using it with real students.

## 📁 Project Structure

```
physioedvance/
├── src/
│   ├── app.js                      # Express entry point, subdomain detection
│   ├── config/subjectTaxonomy.js   # Canonical subject list (source of truth)
│   ├── controllers/                 # public, auth, student, instructor, admin
│   ├── middleware/auth.js
│   ├── models/                      # User, Course, Enrollment, Quiz, Curriculum, Content, Attendance
│   ├── services/                    # paymentService (Razorpay), zoomService, smsService, faceAttendanceClient
│   ├── routes/
│   └── db/
│       ├── schema.sql               # 24 tables
│       ├── migrate.js
│       └── seed.js                  # Real team names, full subject taxonomy, demo courses
├── views/
│   ├── layouts/                      main.ejs (public) / admin.ejs (Velzon-style dashboard)
│   ├── public/                       home, subjects-index, subject-detail, the-team, blog, blog-detail,
│   │                                 live-sessions, courses, course-detail, about, contact
│   ├── auth/, student/, instructor/, admin/
├── public/css, public/js, public/images
├── face-auth-service/                Separate Python microservice (optional)
└── data/                             SQLite database file (auto-created)
```

## 🧭 Next Steps for Production

1. **Logo & brand colors** — swap `/public/images/hero-illustration.svg` and the favicon/icon classes for your real logo once ready; update `--pe-primary` etc. in `public/css/theme.css` if brand colors differ from the current teal/indigo placeholder palette.
2. Switch Razorpay from Test to Live keys once tested end-to-end.
3. Verify the one uncertain team-member name from the original whiteboard photo ("Dr. Manu Krishna" in the Advisory Board) — handwriting was ambiguous; correct in `src/db/seed.js` if needed.
4. Move file uploads (avatars, notes PDFs, blog covers) to S3/Cloudinary instead of local disk.
5. Set a strong, random `SESSION_SECRET` and deploy behind HTTPS.
6. Point real DNS for `subjects.physioedvance.com` per the Subdomains section above.
7. Complete MSG91 DLT registration before sending any real SMS.
8. Consider PostgreSQL for multi-instance deployments (schema is portable).

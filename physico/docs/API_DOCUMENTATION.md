# REST API Documentation Summary

The PhysioEdvance NestJS backend provides OpenAPI 3.0 / Swagger documentation at `/api/docs`.

## Core Endpoint Reference

### Authentication & Biometrics
- `POST /api/v1/auth/register`: Create user account & record biometric consent + face enrollment.
- `POST /api/v1/auth/login-step1`: Primary credential validation (returns challenge ID).
- `POST /api/v1/auth/verify-face`: Step 2 face liveness + embedding match -> issues JWT tokens.
- `POST /api/v1/auth/refresh`: Refresh access token using refresh token.
- `POST /api/v1/auth/re-enroll-face`: Secure re-enrollment of biometric vector.

### Academic Subjects & Notes
- `GET /api/v1/subjects`: Fetch all subjects (with optional year/semester filters).
- `GET /api/v1/subjects/:id`: Fetch detailed subject with chapters, topics, and notes.
- `POST /api/v1/subjects`: (Admin/Teacher) Create new subject.
- `POST /api/v1/subjects/:id/notes`: Upload and attach notes/PDFs.

### LMS & Digital Library
- `GET /api/v1/courses`: List LMS courses.
- `GET /api/v1/courses/:slug`: Fetch course details, lessons, and completion stats.
- `POST /api/v1/courses/:id/enroll`: Enroll student in course.
- `POST /api/v1/courses/lessons/:id/complete`: Mark lesson progress.

### Appointments & Contact
- `POST /api/v1/appointments`: Submit appointment or callback request.
- `GET /api/v1/appointments`: (Admin) View all appointments.
- `PATCH /api/v1/appointments/:id/status`: (Admin) Update appointment status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).

### Payments & Razorpay
- `POST /api/v1/payments/create-order`: Create Razorpay payment order.
- `POST /api/v1/payments/verify`: Server-side signature verification & order fulfillment.

### Live Classes & Zoom
- `GET /api/v1/live-classes`: List upcoming live classes, workshops, webinars.
- `POST /api/v1/live-classes`: (Admin) Schedule new class + generate Zoom link.

### Admin Reports & Analytics
- `GET /api/v1/reports/summary`: Overview platform metrics & revenue stats.
- `GET /api/v1/reports/export`: Export platform data as CSV.

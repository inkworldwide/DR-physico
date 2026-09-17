# System Architecture Specification

## Overview

PhysioEdvance is built as a multi-tier monorepo architecture separating the Next.js 15+ App Router client layer from the NestJS REST API microservice layer.

```text
                                  +-----------------------+
                                  |   Next.js 15+ Client  |
                                  | (React / Tailwind UI) |
                                  +-----------+-----------+
                                              |
                                              | HTTPS / REST / JWT
                                              v
                                  +-----------------------+
                                  |   NestJS REST API     |
                                  | (Guards / RBAC / DTO) |
                                  +-----+-----+-----+-----+
                                        |     |     |
            +---------------------------+     |     +---------------------------+
            |                                 |                                 |
            v                                 v                                 v
+-----------------------+         +-----------------------+         +-----------------------+
|  PostgreSQL Database  |         |     Redis Cache       |         |   AWS S3 Media Bucket |
| (Prisma ORM 37+ Tables|         |  (Sessions / Limits)  |         | (PDFs / Notes / Videos|
+-----------------------+         +-----------------------+         +-----------------------+
```

---

## Technical Stack Details

### Frontend (`/apps/web`)
- **Framework**: Next.js 15 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Healthcare/EdTech design system (Soft White, Soft Teal, Light Blue, Mint, Lavender)
- **UI & Animations**: Lucide icons, Framer Motion
- **Form Validation**: React Hook Form, Zod
- **Data Fetching**: TanStack Query (React Query)
- **Biometric Integration**: Browser Canvas API (`HTMLCanvasElement`, `navigator.mediaDevices.getUserMedia`) for real-time liveness challenge & face frame sampling.

### Backend (`/apps/api`)
- **Framework**: NestJS 10+
- **Database ORM**: Prisma ORM
- **Authentication**: Dual-token JWT (Access Token 15m + Refresh Token Rotation 7d) with Argon2 password hashing.
- **Biometric Service**: Modular `FaceVerificationService` supporting `MockFaceVerificationProvider` (development/testing) and `ProductionFaceVerificationProvider` (AWS Rekognition / ONNX embeddings).
- **Payment Verification**: Server-side Razorpay HMAC SHA256 signature validation.
- **Meeting Provider**: Zoom API Server-to-Server OAuth integration.
- **API Documentation**: OpenAPI 3.0 / Swagger UI at `/api/docs`.

---

## Domain Modules Structure

1. `AuthModule`: Registration, login step-1, JWT refresh rotation, password reset.
2. `FaceVerificationModule`: Biometric enrollment, liveness prompt generation, embedding similarity threshold check, anti-spoofing audit logs.
3. `SubjectsModule`: Year 1-4 main BPT degree subjects + 23 specialized/allied subjects, chapter hierarchy, topics, note attachments.
4. `LmsModule`: Courses, modules, lessons, video tracking, completion percent calculation.
5. `LibraryModule`: Digital library resource indexing & PDF downloads.
6. `ResearchModule`: Scientific research desk papers & case studies.
7. `BlogsModule`: CMS for blogs, tags, SEO metadata, rich text articles.
8. `AppointmentsModule`: Callback requests and appointment management workflows.
9. `PaymentsModule`: Razorpay order creation and signature validation.
10. `LiveClassesModule`: Zoom meeting generator for classes, workshops, webinars.
11. `NotificationsModule`: Multi-channel email, SMS, in-app notifier.
12. `ReportsModule`: Dynamic admin analytics charts and CSV report generator.
13. `AuditModule`: Comprehensive audit logging for security and admin actions.

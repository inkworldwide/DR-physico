# Database Schema Specification (PostgreSQL + Prisma)

## Key Relational Models

- `User`: Primary user accounts (Email, Hashed Password, User Status, Soft Delete).
- `Role` & `Permission`: RBAC mapping (`SUPER_ADMIN`, `ADMIN`, `TEACHER`, `SUBJECT_EXPERT`, `CONTENT_MANAGER`, `STUDENT`, `USER`).
- `FaceEnrollment`: Encrypted facial embedding vectors, enrollment timestamp, consent verification flag.
- `FaceVerificationLog`: Audit logs of liveness results, similarity score, verification status, client IP, user agent.
- `StudentProfile` & `TeacherProfile`: Domain profiles linked to Users.
- `Year` & `Semester`: Academic BPT degree structure (1st Year to 4th Year + Allied).
- `Subject`: All 33 main subjects + 23 specialized subjects.
- `Chapter` & `Topic`: Hierarchical academic unit structure under subjects.
- `Note` & `NoteAttachment`: PDF study materials, reading time estimates, downloadable flags.
- `Course`, `CourseModule`, `Lesson`, `Enrollment`, `Progress`: LMS engine entities.
- `DigitalLibraryItem`: Catalog for books, research notes, study resources.
- `ResearchArticle`: Research desk articles, case studies, biostatistics data.
- `Blog` & `BlogCategory`: CMS blog management entities.
- `Appointment`: Clinical appointment requests & callback bookings (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
- `Payment` & `PaymentTransaction`: Server-verified Razorpay transactions.
- `LiveClass` & `ZoomMeeting`: Zoom meeting schedules for live classes, workshops, webinars.
- `AuditLog`: System-wide audit log tracking sensitive actions.

---

## Indexing & Performance Optimization

- Unique Indexes on `User.email`, `Subject.code`, `Course.slug`, `Blog.slug`.
- Composite Foreign Key Indexes on `Chapter(subjectId, orderIndex)`, `Topic(chapterId, orderIndex)`, `Lesson(moduleId, orderIndex)`.
- Full-Text Search Indexes using PostgreSQL `tsvector` on `Subject.title`, `Note.title`, `ResearchArticle.title`, `Blog.title`.

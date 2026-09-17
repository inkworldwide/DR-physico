# PHYSIOEDVANCE

> **Tagline**: *"Learn Physiotherapy. Understand Better. Practice Smarter. Advance Further."*

PhysioEdvance is a production-ready, SaaS-style EdTech platform designed specifically for physiotherapy undergraduate and postgraduate students, academicians, and healthcare practitioners.

---

## Key Features

- **Biometric Face Verification Layer**: Mandatory 2-Step Login flow with camera activation, interactive liveness detection (head turn/blink/smile challenge), and server-side facial landmark vector similarity matching.
- **Academic Subjects Engine**: Normalized PostgreSQL database storing all **33 Main Core BPT Degree Subjects** (1st to 4th Year) plus **23 Specialized & Allied Subjects** (Dry Needling, Cupping, Myofascial Release, Manual Therapy, Bioengineering...).
- **LMS & Digital Library**: Modular courses, lesson video tracking, quiz evaluation, downloadable study resources, and progress metrics.
- **Research Desk & Blog CMS**: Scientific articles, case studies, biostatistics tools, and content management system.
- **Appointments & Services**: Clinical callback request and patient/student appointment booking workflow with admin status updates (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
- **Razorpay Payments**: Server-side HMAC SHA256 signature verification for course & workshop enrolments.
- **Zoom API Integration**: Scheduling for live classes, workshops, webinars, podcasts, and panel discussions.
- **Admin Control Center**: KPI summary metrics, interactive analytics charts, user management, audit logs, and content management.

---

## Quick Start (Local Development)

### 1. Requirements
- Node.js >= 18.x
- Docker & Docker Compose
- PostgreSQL 15+ (if running locally without Docker)

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Docker Compose Startup
```bash
docker-compose up --build
```

### 4. Running Backend & Frontend via Monorepo Scripts
```bash
npm install
npm run db:seed
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:4000/api/v1`
- **Swagger Documentation**: `http://localhost:4000/api/docs`

---

## Documentation Links

- [Architecture Overview](./ARCHITECTURE.md)
- [Database Schema & Models](./DATABASE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Security & Biometrics Specification](./SECURITY.md)
- [AWS & Container Deployment Guide](./DEPLOYMENT.md)

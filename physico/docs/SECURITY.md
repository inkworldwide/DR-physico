# Security & Biometrics Specification

## Biometric Face Verification Architecture

Every login on PhysioEdvance is secured by a two-step verification process:

```text
1. User enters Email/Phone + Password
   |
   v
2. Server verifies password hash (Argon2 / bcrypt)
   |
   +--> Returns temporary pre-auth token (Challenge ID)
   |
3. Frontend triggers camera feed and liveness prompts (Center Face -> Blink -> Smile)
   |
   v
4. Frontend captures canvas frame & sends to POST /api/v1/auth/verify-face
   |
   v
5. Server-side FaceVerificationService compares face embedding with enrolled vector
   |
   +--> Cosine Similarity >= 0.82 AND Liveness Passed
        |
        v
   Issues JWT Access Token (15m) + Refresh Token Cookie (7d)
```

### Anti-Spoofing & Privacy Principles

1. **No Raw Photos**: Raw face photos are NOT stored in the database. Only mathematical facial landmark vectors (128d / 512d embeddings) are stored.
2. **Encryption at Rest**: Face embeddings are encrypted before persistence in PostgreSQL.
3. **No Frontend Leakage**: API responses NEVER expose raw face vectors.
4. **Provider Abstraction**: `FaceVerificationService` utilizes an abstract `FaceVerificationProvider` pattern, permitting runtime switching between `MockFaceVerificationProvider` (dev) and AWS Rekognition / Custom Server solution (prod).
5. **Rate Limiting & Audit**: Failed verification attempts are rate-limited (max 5 retries) and logged to `FaceVerificationLog` with IP and User-Agent details.

---

## Standard Security Measures

- **JWT Token Security**: Short-lived Access Tokens (15m) paired with Refresh Token Rotation in HttpOnly, SameSite=Strict cookies.
- **RBAC Enforcement**: Server-side Guards (`@UseGuards(JwtAuthGuard, RolesGuard)`) intercept and reject unauthorized role calls independently of frontend UI controls.
- **Data Protection**: Input DTO sanitization via `class-validator`, SQL injection prevention via Prisma parameterization, XSS mitigation, Helmet security headers.

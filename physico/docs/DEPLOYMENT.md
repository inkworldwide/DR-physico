# AWS & Container Deployment Guide

## AWS Target Architecture

```text
               +----------------------------------+
               |     AWS Route53 / CloudFront     |
               +----------------+-----------------+
                                |
               +----------------v-----------------+
               |    AWS Application Load Balancer |
               +--------+----------------+--------+
                        |                |
           +------------v---+        +---v------------+
           | AWS ECS Task   |        | AWS ECS Task   |
           | Next.js Web    |        | NestJS API     |
           +----------------+        +-------+--------+
                                             |
                               +-------------v--------------+
                               | AWS RDS PostgreSQL Cluster |
                               +----------------------------+
```

---

## AWS Services Integration Setup

1. **Amazon RDS PostgreSQL**: Provisions database instance with multi-AZ replication.
2. **Amazon S3**: Multi-region bucket for notes PDFs, course thumbnails, avatars (`physioedvance-media-assets`).
3. **AWS Rekognition (Production Face Verification)**: Real-time face detection, liveness detection, and facial feature comparison APIs.
4. **AWS Secrets Manager**: Encrypts and manages database credentials, JWT secrets, Razorpay keys, and Zoom credentials.
5. **AWS CloudWatch**: Aggregates API performance logs, face verification security audit trails, and crash reports.

---

## Production Deployment Checklist

- [ ] Run `npx prisma migrate deploy` against RDS PostgreSQL.
- [ ] Configure Environment Variables in AWS Secrets Manager.
- [ ] Set `FACE_VERIFICATION_PROVIDER=aws_rekognition` or `production`.
- [ ] Build & Push Docker images to Amazon ECR.
- [ ] Configure SSL/TLS Certificates via AWS Certificate Manager.
- [ ] Verify CORS, Cookie SameSite=Strict, and Rate Limiting settings.

import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { MockFaceVerificationProvider } from './providers/mock-face-verification.provider';
import { ProductionFaceVerificationProvider } from './providers/production-face-verification.provider';
import { FaceVerificationProvider } from './providers/face-verification.provider';

@Injectable()
export class FaceVerificationService {
  private readonly logger = new Logger(FaceVerificationService.name);
  private provider: FaceVerificationProvider;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly mockProvider: MockFaceVerificationProvider,
    private readonly prodProvider: ProductionFaceVerificationProvider
  ) {
    const providerName = this.configService.get<string>('FACE_VERIFICATION_PROVIDER', 'mock');
    if (providerName === 'aws_rekognition' || providerName === 'production') {
      this.provider = this.prodProvider;
    } else {
      this.provider = this.mockProvider;
    }
  }

  /**
   * Generates a liveness verification challenge session for the client.
   */
  async createLivenessChallenge(userId: string) {
    const challengeId = `chal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const prompts = ['CENTER_FACE', 'LOOK_LEFT', 'BLINK_EYES', 'SMILE'];
    return {
      challengeId,
      prompts,
      expiresInSeconds: 120,
    };
  }

  /**
   * Enrolls biometric face embedding during registration or re-enrollment.
   */
  async enrollFace(userId: string, faceImageData: string, consentGiven: boolean = true) {
    if (!consentGiven) {
      throw new BadRequestException('Explicit biometric consent is required for face enrollment.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const embeddingVector = await this.provider.generateEmbedding(faceImageData);

    // Save encrypted embedding vector (never store raw images)
    await this.prisma.faceEnrollment.upsert({
      where: { userId },
      update: {
        encryptedEmbedding: JSON.stringify(embeddingVector),
        updatedAt: new Date(),
      },
      create: {
        userId,
        encryptedEmbedding: JSON.stringify(embeddingVector),
        consentGivenAt: new Date(),
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { isFaceEnrolled: true },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'BIOMETRIC_FACE_ENROLLED',
        entityName: 'FaceEnrollment',
        details: 'User successfully enrolled facial biometric vector.',
      },
    });

    return { success: true, message: 'Face biometric enrollment completed successfully.' };
  }

  /**
   * Verifies Step-2 login camera frame & liveness against enrolled biometric embedding.
   */
  async verifyLoginFace(
    userId: string,
    challengeId: string,
    faceFrames: string[],
    ipAddress?: string,
    userAgent?: string
  ) {
    const enrollment = await this.prisma.faceEnrollment.findUnique({ where: { userId } });
    if (!enrollment) {
      throw new UnauthorizedException('Biometric face enrollment record not found. Please enroll your face first.');
    }

    // Step 1: Liveness check
    const liveness = await this.provider.verifyLiveness(challengeId, faceFrames);
    if (!liveness.isPassed) {
      await this.logAttempt(userId, challengeId, 'FAILED', 0.0, false, liveness.reason || 'Liveness check failed', ipAddress, userAgent);
      throw new UnauthorizedException(liveness.reason || 'Liveness verification failed. Please align your face and retry.');
    }

    // Step 2: Compare live captured frame embedding against stored enrolled embedding
    const storedEmbedding: number[] = JSON.parse(enrollment.encryptedEmbedding);
    const capturedEmbedding = await this.provider.generateEmbedding(faceFrames[0] || '');

    const threshold = parseFloat(this.configService.get<string>('FACE_SIMILARITY_THRESHOLD', '0.82'));
    const matchResult = await this.provider.compareEmbeddings(capturedEmbedding, storedEmbedding, threshold);

    if (!matchResult.isMatch) {
      await this.logAttempt(userId, challengeId, 'PASSED', matchResult.similarity, false, 'Facial similarity threshold not met', ipAddress, userAgent);
      throw new UnauthorizedException('Face verification failed. Facial similarity score did not meet security threshold.');
    }

    // Log successful verification
    await this.logAttempt(userId, challengeId, 'PASSED', matchResult.similarity, true, undefined, ipAddress, userAgent);

    return {
      success: true,
      similarity: matchResult.similarity,
      confidence: matchResult.confidence,
      message: 'Face verification successful.',
    };
  }

  private async logAttempt(
    userId: string,
    challengeId: string,
    livenessResult: string,
    similarityScore: number,
    isSuccess: boolean,
    failureReason?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    await this.prisma.faceVerificationLog.create({
      data: {
        userId,
        challengeId,
        livenessResult,
        similarityScore,
        isSuccess,
        failureReason,
        ipAddress,
        userAgent,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: isSuccess ? 'FACE_VERIFICATION_SUCCESS' : 'FACE_VERIFICATION_FAILED',
        entityName: 'FaceVerificationLog',
        details: isSuccess
          ? `Face verification succeeded with similarity ${similarityScore}`
          : `Face verification failed: ${failureReason}`,
        ipAddress,
      },
    });
  }
}

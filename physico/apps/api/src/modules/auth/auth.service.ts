import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { FaceVerificationService } from '../face-verification/face-verification.service';
import { RegisterDto, LoginStep1Dto, VerifyFaceStep2Dto, RefreshTokenDto, ReEnrollFaceDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { RoleName } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly faceVerificationService: FaceVerificationService
  ) {}

  /**
   * Registers a new user account with initial biometric face enrollment.
   */
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('An account with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const studentRole = await this.prisma.role.findUnique({ where: { name: RoleName.STUDENT } });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        isEmailVerified: true,
        userRoles: {
          create: [{ roleId: studentRole.id }],
        },
        studentProfile: {
          create: {},
        },
      },
    });

    // Enroll face embedding vector
    await this.faceVerificationService.enrollFace(user.id, dto.faceImageData, dto.biometricConsent);

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        entityName: 'User',
        entityId: user.id,
        details: `User ${user.email} registered successfully with face biometric enrollment.`,
      },
    });

    return {
      message: 'Registration and face enrollment completed successfully. Please log in.',
      userId: user.id,
      email: user.email,
    };
  }

  /**
   * Step 1 Login: Verifies credentials & generates biometric liveness challenge session.
   */
  async loginStep1(dto: LoginStep1Dto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: { include: { role: true } },
      },
    });

    if (!user || user.isArchived) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.isFaceEnrolled) {
      throw new UnauthorizedException('Face enrollment missing. Please contact support or re-register.');
    }

    // Generate liveness challenge session
    const challenge = await this.faceVerificationService.createLivenessChallenge(user.id);

    return {
      requiresFaceVerification: true,
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      challenge,
    };
  }

  /**
   * Step 2 Login: Verifies camera frames & face embedding vector similarity, then issues JWT access & refresh tokens.
   */
  async verifyFaceStep2(dto: VerifyFaceStep2Dto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      include: {
        userRoles: { include: { role: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User session invalid.');
    }

    // Step 2 Face Verification
    await this.faceVerificationService.verifyLoginFace(
      dto.userId,
      dto.challengeId,
      dto.faceFrames,
      ipAddress,
      userAgent
    );

    const roles = user.userRoles.map((ur) => ur.role.name);

    // Issue Tokens
    const tokens = await this.generateTokens(user.id, user.email, roles);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 86400000), // 7 days
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        roles,
        isFaceEnrolled: user.isFaceEnrolled,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  /**
   * Refreshes JWT access token using valid refresh token.
   */
  async refreshToken(dto: RefreshTokenDto) {
    const session = await this.prisma.session.findUnique({
      where: { token: dto.refreshToken },
      include: {
        user: {
          include: {
            userRoles: { include: { role: true } },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const roles = session.user.userRoles.map((ur) => ur.role.name);
    const tokens = await this.generateTokens(session.user.id, session.user.email, roles);

    // Rotate Refresh Token
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 86400000),
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Secure face re-enrollment for authenticated user.
   */
  async reEnrollFace(userId: string, dto: ReEnrollFaceDto) {
    return this.faceVerificationService.enrollFace(userId, dto.faceImageData, dto.biometricConsent);
  }

  private async generateTokens(userId: string, email: string, roles: string[]) {
    const payload = { sub: userId, email, roles };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'super_secret_jwt_access_key_physioedvance_2026'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'super_secret_jwt_refresh_key_physioedvance_2026'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FaceVerificationService } from '../face-verification/face-verification.service';

describe('AuthService & Biometrics Unit Tests', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn(), create: jest.fn() },
            role: { findUnique: jest.fn() },
            auditLog: { create: jest.fn() },
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock_jwt_token') },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock_secret') },
        },
        {
          provide: FaceVerificationService,
          useValue: {
            enrollFace: jest.fn().mockResolvedValue({ success: true }),
            createLivenessChallenge: jest.fn().mockResolvedValue({ challengeId: 'chal_123' }),
            verifyLoginFace: jest.fn().mockResolvedValue({ success: true, similarity: 0.92 }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

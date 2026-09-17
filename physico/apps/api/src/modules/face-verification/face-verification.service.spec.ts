import { Test, TestingModule } from '@nestjs/testing';
import { FaceVerificationService } from './face-verification.service';
import { MockFaceVerificationProvider } from './providers/mock-face-verification.provider';
import { ProductionFaceVerificationProvider } from './providers/production-face-verification.provider';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('FaceVerificationService & Vector Math Tests', () => {
  let service: FaceVerificationService;
  let mockProvider: MockFaceVerificationProvider;

  beforeEach(async () => {
    mockProvider = new MockFaceVerificationProvider();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FaceVerificationService,
        MockFaceVerificationProvider,
        ProductionFaceVerificationProvider,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn(), update: jest.fn() },
            faceEnrollment: { findUnique: jest.fn(), upsert: jest.fn() },
            faceVerificationLog: { create: jest.fn() },
            auditLog: { create: jest.fn() },
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock') },
        },
      ],
    }).compile();

    service = module.get<FaceVerificationService>(FaceVerificationService);
  });

  it('should calculate normalized 128d vector embedding with cosine similarity', async () => {
    const vec1 = await mockProvider.generateEmbedding('test_face_frame_1');
    const vec2 = await mockProvider.generateEmbedding('test_face_frame_1');
    expect(vec1.length).toBe(128);

    const match = await mockProvider.compareEmbeddings(vec1, vec2, 0.80);
    expect(match.isMatch).toBe(true);
    expect(match.similarity).toBeGreaterThanOrEqual(0.80);
  });
});

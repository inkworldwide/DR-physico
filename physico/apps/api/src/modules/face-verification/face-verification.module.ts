import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FaceVerificationService } from './face-verification.service';
import { MockFaceVerificationProvider } from './providers/mock-face-verification.provider';
import { ProductionFaceVerificationProvider } from './providers/production-face-verification.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    FaceVerificationService,
    MockFaceVerificationProvider,
    ProductionFaceVerificationProvider,
  ],
  exports: [FaceVerificationService],
})
export class FaceVerificationModule {}

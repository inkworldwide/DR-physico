import { IsEmail, IsString, MinLength, IsOptional, IsBoolean, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'student@physioedvance.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'PhysioPass123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Aarav' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Sharma' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+91 9123456789', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  biometricConsent: boolean;

  @ApiProperty({ example: 'data:image/jpeg;base64,...' })
  @IsString()
  @IsNotEmpty()
  faceImageData: string;
}

export class LoginStep1Dto {
  @ApiProperty({ example: 'student@physioedvance.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'PhysioPass123!' })
  @IsString()
  password: string;
}

export class VerifyFaceStep2Dto {
  @ApiProperty({ example: 'usr_123...' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'chal_123...' })
  @IsString()
  @IsNotEmpty()
  challengeId: string;

  @ApiProperty({ example: ['data:image/jpeg;base64,...'] })
  @IsArray()
  faceFrames: string[];
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class ReEnrollFaceDto {
  @ApiProperty({ example: 'data:image/jpeg;base64,...' })
  @IsString()
  @IsNotEmpty()
  faceImageData: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  biometricConsent: boolean;
}

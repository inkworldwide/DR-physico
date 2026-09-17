import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginStep1Dto, VerifyFaceStep2Dto, RefreshTokenDto, ReEnrollFaceDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Authentication & Biometrics')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register student user with biometric face enrollment' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login-step1')
  @ApiOperation({ summary: 'Step 1 Login: Validate email/password credentials and generate face verification challenge' })
  async loginStep1(@Body() dto: LoginStep1Dto) {
    return this.authService.loginStep1(dto);
  }

  @Post('verify-face')
  @ApiOperation({ summary: 'Step 2 Login: Camera face frame verification & vector matching to issue JWT tokens' })
  async verifyFaceStep2(@Body() dto: VerifyFaceStep2Dto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.verifyFaceStep2(dto, ip, userAgent);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT access token using refresh token' })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile and roles' })
  async getMe(@Req() req: any) {
    return req.user;
  }

  @Post('re-enroll-face')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Re-enroll user face biometric embedding' })
  async reEnrollFace(@Req() req: any, @Body() dto: ReEnrollFaceDto) {
    return this.authService.reEnrollFace(req.user.id, dto);
  }
}

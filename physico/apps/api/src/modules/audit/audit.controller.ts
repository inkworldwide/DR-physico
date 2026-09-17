import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RoleName } from '@prisma/client';

@ApiTags('Admin Security Audit Logs')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Admin: View system action audit logs' })
  async getAuditLogs() {
    return this.auditService.getAuditLogs();
  }

  @Get('face-verifications')
  @ApiOperation({ summary: 'Admin: View face verification security audit logs' })
  async getFaceLogs() {
    return this.auditService.getFaceVerificationLogs();
  }
}

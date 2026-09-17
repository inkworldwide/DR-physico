import { Controller, Get, UseGuards, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RoleName } from '@prisma/client';

@ApiTags('Admin Reports & Analytics')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Admin: Overview platform statistics, revenue, and face verification success metrics' })
  async getSummary() {
    return this.reportsService.getPlatformSummary();
  }

  @Get('export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="physioedvance_users_report.csv"')
  @ApiOperation({ summary: 'Admin: Export platform user activity as CSV stream' })
  async exportCsv() {
    return this.reportsService.exportReportCsv();
  }
}

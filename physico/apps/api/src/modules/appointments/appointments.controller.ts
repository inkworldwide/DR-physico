import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { AppointmentStatus, RoleName } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@ApiTags('Appointments & Callback Requests')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Public: Submit consultation appointment request' })
  async bookAppointment(@Body() body: any) {
    return this.appointmentsService.createAppointment(body);
  }

  @Post('callback')
  @ApiOperation({ summary: 'Public: Request a quick callback' })
  async requestCallback(@Body() body: { name: string; phone: string; preferredTime?: string }) {
    return this.appointmentsService.createCallbackRequest(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Get all appointments' })
  async getAllAppointments(@Query('status') status?: AppointmentStatus) {
    return this.appointmentsService.findAllAppointments(status);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Update appointment status (PENDING, CONFIRMED, CANCELLED, COMPLETED)' })
  async updateStatus(@Param('id') id: string, @Body() body: { status: AppointmentStatus; adminNotes?: string }) {
    return this.appointmentsService.updateAppointmentStatus(id, body.status, body.adminNotes);
  }
}

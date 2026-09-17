import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAppointment(data: {
    name: string;
    email: string;
    phone: string;
    preferredDate: string;
    preferredTime: string;
    service: string;
    message?: string;
  }) {
    const appointment = await this.prisma.appointment.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        service: data.service,
        message: data.message,
        status: AppointmentStatus.PENDING,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'CREATE_APPOINTMENT',
        entityName: 'Appointment',
        entityId: appointment.id,
        details: `Appointment booked by ${data.name} for ${data.preferredDate}`,
      },
    });

    return appointment;
  }

  async createCallbackRequest(data: { name: string; phone: string; preferredTime?: string }) {
    return this.prisma.callbackRequest.create({
      data: {
        name: data.name,
        phone: data.phone,
        preferredTime: data.preferredTime,
        status: AppointmentStatus.PENDING,
      },
    });
  }

  async findAllAppointments(status?: AppointmentStatus) {
    const where = status ? { status } : {};
    return this.prisma.appointment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAppointmentStatus(id: string, status: AppointmentStatus, adminNotes?: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found.');

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status,
        adminNotes,
      },
    });
  }
}

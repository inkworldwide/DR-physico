import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LiveClassCategory } from '@prisma/client';

@Injectable()
export class LiveClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: LiveClassCategory) {
    const where = category ? { category } : {};
    return this.prisma.liveClass.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async createLiveClass(data: {
    title: string;
    instructor: string;
    scheduledAt: string;
    durationMinutes?: number;
    description: string;
    category?: LiveClassCategory;
    zoomMeetingUrl?: string;
  }) {
    const meetingId = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;
    const zoomUrl = data.zoomMeetingUrl || `https://zoom.us/j/${meetingId.replace(/\s+/g, '')}`;

    return this.prisma.liveClass.create({
      data: {
        title: data.title,
        instructor: data.instructor,
        scheduledAt: new Date(data.scheduledAt),
        durationMinutes: data.durationMinutes || 60,
        description: data.description,
        category: data.category || LiveClassCategory.CLASS,
        zoomMeetingUrl: zoomUrl,
        zoomMeetingId: meetingId,
        registrationUrl: `https://physioedvance.com/live-classes/${Date.now()}`,
      },
    });
  }
}

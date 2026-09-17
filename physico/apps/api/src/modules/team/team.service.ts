import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TeamCategory } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: TeamCategory) {
    const where = category ? { category } : {};
    return this.prisma.teamMember.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResearchService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string, search?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { abstractText: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.researchArticle.findMany({
      where,
      orderBy: { publishedDate: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.researchArticle.findUnique({ where: { slug } });
  }
}

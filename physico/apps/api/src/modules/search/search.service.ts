import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchGlobal(query: string) {
    if (!query || query.trim().length === 0) {
      return { subjects: [], notes: [], courses: [], blogs: [], research: [] };
    }

    const q = query.trim();

    const [subjects, notes, courses, blogs, research] = await Promise.all([
      this.prisma.subject.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      this.prisma.note.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      this.prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      this.prisma.blog.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { summary: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      this.prisma.researchArticle.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { abstractText: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
    ]);

    return { subjects, notes, courses, blogs, research };
  }
}

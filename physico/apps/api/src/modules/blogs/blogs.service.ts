import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(categorySlug?: string, search?: string) {
    const where: any = { isPublished: true };
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.blog.findMany({
      where,
      include: {
        category: true,
        author: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
      include: {
        category: true,
        author: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    if (!blog) throw new NotFoundException('Blog post not found.');
    return blog;
  }
}

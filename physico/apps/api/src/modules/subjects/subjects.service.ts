import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AcademicYearEnum, SubjectCategory } from '@prisma/client';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves filterable list of subjects with academic year and category filters.
   */
  async findAll(yearCode?: AcademicYearEnum, category?: SubjectCategory, search?: string) {
    const whereClause: any = { isPublished: true };

    if (yearCode) {
      whereClause.year = { code: yearCode };
    }

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const subjects = await this.prisma.subject.findMany({
      where: whereClause,
      include: {
        year: true,
        chapters: {
          select: {
            id: true,
            title: true,
            topics: {
              select: {
                id: true,
                title: true,
                notes: { select: { id: true, title: true, pdfUrl: true } },
              },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    return subjects.map((s) => ({
      id: s.id,
      title: s.title,
      code: s.code,
      description: s.description,
      academicYear: s.year.code,
      yearDisplayName: s.year.displayName,
      category: s.category,
      icon: s.icon,
      coverImage: s.coverImage,
      chaptersCount: s.chapters.length,
      topicsCount: s.chapters.reduce((acc, c) => acc + c.topics.length, 0),
      notesCount: s.chapters.reduce(
        (acc, c) => acc + c.topics.reduce((tAcc, top) => tAcc + top.notes.length, 0),
        0
      ),
    }));
  }

  /**
   * Fetches single subject with full chapter, topic, and notes hierarchy.
   */
  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        year: true,
        semester: true,
        chapters: {
          orderBy: { orderIndex: 'asc' },
          include: {
            topics: {
              orderBy: { orderIndex: 'asc' },
              include: {
                notes: {
                  where: { isPublished: true },
                  include: { attachments: true },
                },
              },
            },
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found.`);
    }

    return subject;
  }

  /**
   * Admin: Creates a new subject.
   */
  async createSubject(data: {
    title: string;
    code: string;
    description: string;
    yearCode: AcademicYearEnum;
    category?: SubjectCategory;
    icon?: string;
    coverImage?: string;
  }) {
    const year = await this.prisma.year.findUnique({ where: { code: data.yearCode } });
    if (!year) {
      throw new BadRequestException(`Academic year ${data.yearCode} not found.`);
    }

    const subject = await this.prisma.subject.create({
      data: {
        title: data.title,
        code: data.code,
        description: data.description,
        yearId: year.id,
        category: data.category || SubjectCategory.CORE,
        icon: data.icon || 'BookOpen',
        coverImage: data.coverImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
        isPublished: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'CREATE_SUBJECT',
        entityName: 'Subject',
        entityId: subject.id,
        details: `Created subject ${subject.title} (${subject.code})`,
      },
    });

    return subject;
  }

  /**
   * Admin: Creates a note attached to a topic.
   */
  async createNote(topicId: string, data: { title: string; description?: string; pdfUrl: string }) {
    const note = await this.prisma.note.create({
      data: {
        topicId,
        title: data.title,
        description: data.description,
        pdfUrl: data.pdfUrl,
        isPublished: true,
      },
    });

    return note;
  }
}

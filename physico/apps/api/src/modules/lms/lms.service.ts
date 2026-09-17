import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LmsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCourses() {
    return this.prisma.course.findMany({
      where: { isPublished: true },
      include: {
        modules: {
          include: { lessons: true },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCourseBySlug(slug: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
        quizzes: {
          include: { questions: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug ${slug} not found.`);
    }

    let userEnrollment = null;
    if (userId) {
      userEnrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentId_courseId: { studentId: userId, courseId: course.id },
        },
        include: {
          lessonProgress: true,
        },
      });
    }

    return { ...course, userEnrollment };
  }

  async enrollStudent(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: userId, courseId } },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.enrollment.create({
      data: {
        studentId: userId,
        courseId,
        progressPercent: 0,
      },
    });
  }

  async markLessonProgress(userId: string, lessonId: string, isCompleted: boolean) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });

    if (!lesson) throw new NotFoundException('Lesson not found.');

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId: userId, courseId: lesson.module.courseId },
      },
    });

    if (!enrollment) throw new NotFoundException('Enrollment not found. Please enroll in the course first.');

    await this.prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Recalculate progress
    const allLessonsCount = await this.prisma.lesson.count({
      where: { module: { courseId: lesson.module.courseId } },
    });

    const completedLessonsCount = await this.prisma.lessonProgress.count({
      where: { enrollmentId: enrollment.id, isCompleted: true },
    });

    const progressPercent = Number(((completedLessonsCount / (allLessonsCount || 1)) * 100).toFixed(1));

    const updatedEnrollment = await this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPercent,
        isCompleted: progressPercent >= 100,
      },
    });

    return { success: true, progressPercent, isCompleted: updatedEnrollment.isCompleted };
  }

  async getUserEnrolledCourses(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { studentId: userId },
      include: {
        course: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }
}

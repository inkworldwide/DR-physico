import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LmsService } from './lms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Digital LMS & Courses')
@Controller('courses')
export class LmsController {
  constructor(private readonly lmsService: LmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get catalog of all published LMS courses' })
  async getCourses() {
    return this.lmsService.findAllCourses();
  }

  @Get('my-courses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current student enrolled courses and progress' })
  async getMyCourses(@Req() req: any) {
    return this.lmsService.getUserEnrolledCourses(req.user.id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get course details with modules, lessons, and student enrollment status' })
  async getCourseBySlug(@Param('slug') slug: string, @Req() req: any) {
    const userId = req.user?.id;
    return this.lmsService.findCourseBySlug(slug, userId);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll current student in course' })
  async enrollCourse(@Param('id') courseId: string, @Req() req: any) {
    return this.lmsService.enrollStudent(req.user.id, courseId);
  }

  @Post('lessons/:id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark lesson completion status and update student course progress percentage' })
  async markLessonProgress(
    @Param('id') lessonId: string,
    @Body() body: { isCompleted: boolean },
    @Req() req: any
  ) {
    return this.lmsService.markLessonProgress(req.user.id, lessonId, body.isCompleted);
  }
}

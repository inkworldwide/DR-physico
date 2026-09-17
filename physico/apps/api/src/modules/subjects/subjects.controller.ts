import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { AcademicYearEnum, SubjectCategory, RoleName } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@ApiTags('Academic Subjects & Notes')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get filterable list of all academic subjects (1st-4th Year & Allied)' })
  @ApiQuery({ name: 'year', enum: AcademicYearEnum, required: false })
  @ApiQuery({ name: 'category', enum: SubjectCategory, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getAllSubjects(
    @Query('year') year?: AcademicYearEnum,
    @Query('category') category?: SubjectCategory,
    @Query('search') search?: string
  ) {
    return this.subjectsService.findAll(year, category, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subject details with full chapter, topic, and notes tree' })
  async getSubjectById(@Param('id') id: string) {
    return this.subjectsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.CONTENT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin/Teacher: Create a new academic subject' })
  async createSubject(@Body() body: any) {
    return this.subjectsService.createSubject(body);
  }

  @Post('topics/:topicId/notes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.TEACHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin/Teacher: Create note under a topic' })
  async createNote(@Param('topicId') topicId: string, @Body() body: { title: string; description?: string; pdfUrl: string }) {
    return this.subjectsService.createNote(topicId, body);
  }
}

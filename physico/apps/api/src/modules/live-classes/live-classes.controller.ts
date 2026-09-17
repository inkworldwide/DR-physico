import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LiveClassesService } from './live-classes.service';
import { LiveClassCategory, RoleName } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@ApiTags('Live Classes & Zoom Events')
@Controller('live-classes')
export class LiveClassesController {
  constructor(private readonly liveClassesService: LiveClassesService) {}

  @Get()
  @ApiOperation({ summary: 'Get upcoming live classes, workshops, and webinars' })
  async getLiveClasses(@Query('category') category?: LiveClassCategory) {
    return this.liveClassesService.findAll(category);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.TEACHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin/Teacher: Schedule live class and generate Zoom meeting credentials' })
  async scheduleLiveClass(@Body() body: any) {
    return this.liveClassesService.createLiveClass(body);
  }
}

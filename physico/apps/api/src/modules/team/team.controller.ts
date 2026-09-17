import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { TeamCategory } from '@prisma/client';

@ApiTags('Faculty & Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'Get teaching staff, subject experts, and team directory' })
  async getTeamMembers(@Query('category') category?: TeamCategory) {
    return this.teamService.findAll(category);
  }
}

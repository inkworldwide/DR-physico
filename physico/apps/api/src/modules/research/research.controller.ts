import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResearchService } from './research.service';

@ApiTags('Research Desk')
@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get()
  @ApiOperation({ summary: 'Get research articles, case studies, and biostatistics resources' })
  async getArticles(@Query('category') category?: string, @Query('search') search?: string) {
    return this.researchService.findAll(category, search);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get single research article by slug' })
  async getArticleBySlug(@Param('slug') slug: string) {
    return this.researchService.findBySlug(slug);
  }
}

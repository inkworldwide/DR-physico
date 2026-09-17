import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';

@ApiTags('Blog CMS')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get published blog posts' })
  async getBlogs(@Query('category') category?: string, @Query('search') search?: string) {
    return this.blogsService.findAll(category, search);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get blog post by slug' })
  async getBlogBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }
}

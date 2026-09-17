import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Global Platform Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global search across subjects, notes, courses, blogs, and research papers' })
  async search(@Query('q') query: string) {
    return this.searchService.searchGlobal(query);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LibraryService } from './library.service';

@ApiTags('Digital Library')
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  @ApiOperation({ summary: 'Get digital library books, PDFs, and study materials' })
  async getLibraryItems(@Query('category') category?: string, @Query('search') search?: string) {
    return this.libraryService.findAllItems(category, search);
  }
}

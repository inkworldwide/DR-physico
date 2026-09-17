import { Module } from '@nestjs/common';
import { LiveClassesService } from './live-classes.service';
import { LiveClassesController } from './live-classes.controller';

@Module({
  controllers: [LiveClassesController],
  providers: [LiveClassesService],
  exports: [LiveClassesService],
})
export class LiveClassesModule {}

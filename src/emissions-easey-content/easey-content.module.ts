import { Module } from '@nestjs/common';
import { EaseyContentService } from './easey-content.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EaseyContentService],
  exports: [EaseyContentService],
})
export class EaseyContentModule {}
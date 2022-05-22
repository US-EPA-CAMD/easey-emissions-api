import { Module } from '@nestjs/common';

import { StreamingService } from './streaming.service';

@Module({
  imports: [],
  controllers: [],
  providers: [StreamingService],
  exports: [StreamingService],
})
export class StreamingModule {}

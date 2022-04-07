import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StreamService } from './stream.service';

@Module({
  providers: [ConfigService, StreamService],
  exports: [StreamService],
})
export class StreamModule {}

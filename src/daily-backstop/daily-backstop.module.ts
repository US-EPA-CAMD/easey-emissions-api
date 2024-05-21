import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyBackstopMap } from '../maps/daily-backstop.map';
import { DailyBackstopRepository } from './daily-backstop.repository';
import { DailyBackstopService } from './daily-backstop.service';

@Module({
  imports: [TypeOrmModule.forFeature([DailyBackstopRepository])],
  controllers: [],
  providers: [DailyBackstopRepository, DailyBackstopService, DailyBackstopMap],
  exports: [
    TypeOrmModule,
    DailyBackstopRepository,
    DailyBackstopService,
    DailyBackstopMap,
  ],
})
export class DailyBackstopModule {}

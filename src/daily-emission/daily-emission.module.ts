import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyFuelModule } from '../daily-fuel/daily-fuel.module';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyEmissionRepository } from './daily-emission.repository';
import { DailyEmissionService } from './daily-emission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyEmissionRepository]),
    DailyFuelModule,
  ],
  providers: [DailyEmissionMap, DailyEmissionRepository, DailyEmissionService],
  exports: [
    TypeOrmModule,
    DailyEmissionMap,
    DailyEmissionRepository,
    DailyEmissionService,
  ],
})
export class DailyEmissionModule {}

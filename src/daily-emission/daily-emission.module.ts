import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyEmissionRepository } from './daily-emission.repository';
import { DailyEmissionService } from './daily-emission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyEmissionRepository, DailyFuelRepository]),
  ],
  providers: [
    DailyEmissionMap,
    DailyEmissionRepository,
    DailyEmissionService,
    DailyFuelMap,
    DailyFuelRepository,
    DailyFuelService,
  ],
})
export class DailyEmissionModule {}

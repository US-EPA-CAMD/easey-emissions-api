import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyFuelRepository } from './daily-fuel.repository';
import { DailyFuelService } from './daily-fuel.service';

@Module({
  imports: [TypeOrmModule.forFeature([DailyFuelRepository])],
  providers: [DailyFuelMap, DailyFuelRepository, DailyFuelService],
  exports: [TypeOrmModule, DailyFuelMap, DailyFuelRepository, DailyFuelService],
})
export class DailyFuelModule {}

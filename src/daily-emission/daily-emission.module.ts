import { Module } from '@nestjs/common';
import { DailyEmissionService } from './daily-emission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEmissionRepository } from './daily-emission.repository';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyEmissionRepository, DailyFuelRepository]),
  ],
  providers: [DailyEmissionService, DailyFuelService],
})
export class DailyEmissionModule {}

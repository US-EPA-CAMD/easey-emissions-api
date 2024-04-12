import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyFuelRepository } from './daily-fuel.repository';
import { DailyFuelService } from './daily-fuel.service';

@Module({
  imports: [TypeOrmModule.forFeature([DailyFuelRepository])],
  providers: [DailyFuelRepository, DailyFuelService],
})
export class DailyFuelModule {}

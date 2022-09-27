import { Module } from '@nestjs/common';
import { DailyFuelService } from './daily-fuel.service';

@Module({
  providers: [DailyFuelService]
})
export class DailyFuelModule {}

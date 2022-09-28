import { Module } from '@nestjs/common';
import { DailyFuelService } from './daily-fuel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyFuelRepository } from './daily-fuel.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DailyFuelRepository])],
  providers: [DailyFuelService],
})
export class DailyFuelModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MonitorHourlyValueModule } from '../monitor-hourly-value/monitor-hourly-value.module';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingService } from './hourly-operating.service';

@Module({
  imports: [TypeOrmModule.forFeature([HourlyOperatingRepository]), MonitorHourlyValueModule],
  controllers: [],
  providers: [HourlyOperatingMap, HourlyOperatingService],
  exports: [TypeOrmModule, HourlyOperatingMap, HourlyOperatingService],
})
export class HourlyOperatingModule {}

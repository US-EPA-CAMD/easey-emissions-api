import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorHourlyValueMap } from 'src/maps/monitor-hourly-value.map';
import { MonitorHourlyValueRepository } from './monitor-hourly-value.repository';
import { MonitorHourlyValueService } from './monitor-hourly-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorHourlyValueRepository])],
  providers: [MonitorHourlyValueMap, MonitorHourlyValueService],
  exports: [TypeOrmModule, MonitorHourlyValueMap, MonitorHourlyValueService],
})
export class MonitorHourlyValueModule {}

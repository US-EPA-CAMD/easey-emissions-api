import { Module } from '@nestjs/common';
import { MatsMonitorHrlyValueService } from './mats-monitor-hrly-value.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatsMonitorHrlyValueRepository } from './mats-monitor-hrly-value.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MatsMonitorHrlyValueRepository])],
  providers: [MatsMonitorHrlyValueService],
})
export class MatsMonitorHrlyValueModule {}

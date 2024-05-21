import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSystemRepository } from './monitor-system.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorSystemRepository])],
  providers: [MonitorSystemRepository],
  exports: [TypeOrmModule, MonitorSystemRepository],
})
export class MonitorSystemModule {}

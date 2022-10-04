import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityService } from './weekly-system-integrity.service';
import { WeeklySystemIntegrityRepository } from './weekly-system-integrity.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WeeklySystemIntegrityRepository])],
  providers: [WeeklySystemIntegrityMap, WeeklySystemIntegrityService],
  exports: [
    TypeOrmModule,
    WeeklySystemIntegrityMap,
    WeeklySystemIntegrityService,
  ],
})
export class WeeklySystemIntegrityModule {}

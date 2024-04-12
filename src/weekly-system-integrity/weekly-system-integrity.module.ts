import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityRepository } from './weekly-system-integrity.repository';
import { WeeklySystemIntegrityService } from './weekly-system-integrity.service';

@Module({
  imports: [TypeOrmModule.forFeature([WeeklySystemIntegrityRepository])],
  providers: [
    WeeklySystemIntegrityMap,
    WeeklySystemIntegrityRepository,
    WeeklySystemIntegrityService,
  ],
  exports: [
    TypeOrmModule,
    WeeklySystemIntegrityMap,
    WeeklySystemIntegrityService,
  ],
})
export class WeeklySystemIntegrityModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationService } from './daily-calibration.service';
import { DailyCalibrationRepository } from './daily-calibration.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyCalibrationRepository]),
  ],
  controllers: [],
  providers: [
    DailyCalibrationMap,
    DailyCalibrationService,
  ],
  exports: [
    TypeOrmModule,
    DailyCalibrationMap,
    DailyCalibrationService,
  ],
})
export class DailyCalibrationModule {}

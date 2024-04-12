import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationRepository } from './daily-calibration.repository';
import { DailyCalibrationService } from './daily-calibration.service';

@Module({
  imports: [TypeOrmModule.forFeature([DailyCalibrationRepository])],
  controllers: [],
  providers: [
    DailyCalibrationMap,
    DailyCalibrationRepository,
    DailyCalibrationService,
  ],
  exports: [TypeOrmModule, DailyCalibrationMap, DailyCalibrationService],
})
export class DailyCalibrationModule {}

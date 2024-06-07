import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationWorkspaceRepository } from './daily-calibration.repository';
import { DailyCalibrationWorkspaceService } from './daily-calibration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyCalibrationWorkspaceRepository]),
    BulkLoadModule,
  ],
  controllers: [],
  providers: [
    DailyCalibrationMap,
    DailyCalibrationWorkspaceRepository,
    DailyCalibrationWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    DailyCalibrationMap,
    DailyCalibrationWorkspaceRepository,
    DailyCalibrationWorkspaceService,
  ],
})
export class DailyCalibrationWorkspaceModule {}

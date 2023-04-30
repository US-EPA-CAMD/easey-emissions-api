import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationWorkspaceService } from './daily-calibration.service';
import { DailyCalibrationWorkspaceRepository } from './daily-calibration.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyCalibrationWorkspaceRepository]),
    BulkLoadModule,
  ],
  controllers: [],
  providers: [DailyCalibrationMap, DailyCalibrationWorkspaceService],
  exports: [
    TypeOrmModule,
    DailyCalibrationMap,
    DailyCalibrationWorkspaceService,
  ],
})
export class DailyCalibrationWorkspaceModule {}

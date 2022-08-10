import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationRepository } from './daily-calibration.repository';

@Injectable()
export class DailyCalibrationService {
  constructor(
    private readonly map: DailyCalibrationMap,
    private readonly repository: DailyCalibrationRepository,
    private readonly configService: ConfigService,
  ) { }
}
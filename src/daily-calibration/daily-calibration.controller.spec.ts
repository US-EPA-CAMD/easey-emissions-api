import { DailyCalibrationController } from './daily-calibration.controller';
import { Test } from '@nestjs/testing';
import { DailyCalibrationService } from './daily-calibration.service';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationRepository } from './daily-calibration.repository';

describe('DailyCalibrationController', () => {
  let dailyCalibrationController: DailyCalibrationController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DailyCalibrationRepository,
        DailyCalibrationController,
        DailyCalibrationService,
        DailyCalibrationMap,
      ],
    }).compile();

    dailyCalibrationController = module.get(DailyCalibrationController);
  });

  it('should get daily calibrations', async function() {
    await expect(
      dailyCalibrationController.getDailyCalibrations(),
    ).resolves.toEqual(undefined);
  });
});

import { Test } from '@nestjs/testing';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationWorkspaceController } from './daily-calibration.controller';
import { DailyCalibrationWorkspaceRepository } from './daily-calibration.repository';
import { DailyCalibrationWorkspaceService } from './daily-calibration.service';

describe('DailyCalibrationController', () => {
  let dailyCalibrationController: DailyCalibrationWorkspaceController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DailyCalibrationWorkspaceRepository,
        DailyCalibrationWorkspaceController,
        DailyCalibrationWorkspaceService,
        DailyCalibrationMap,
      ],
    }).compile();

    dailyCalibrationController = module.get(
      DailyCalibrationWorkspaceController,
    );
  });

  it('should get daily calibrations', async function() {
    await expect(
      dailyCalibrationController.getDailyCalibrations(),
    ).resolves.toEqual(undefined);
  });
});

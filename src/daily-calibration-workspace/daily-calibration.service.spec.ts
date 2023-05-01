import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationWorkspaceService } from './daily-calibration.service';
import { DailyCalibrationWorkspaceRepository } from './daily-calibration.repository';
import { DailyCalibrationImportDTO } from '../dto/daily-calibration.dto';

const dailyCalibrationRepositoryMock = {
  delete: jest.fn().mockResolvedValue(undefined),
  create: jest.fn().mockResolvedValue(undefined),
  save: jest.fn().mockResolvedValue({
    id: '123',
    dailyTestSumId: '123',
  }),
};

const writeObjectMock = jest.fn();

describe('Daily Calibration Workspace Spervice', () => {
  let dailyCalibrationService: DailyCalibrationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyCalibrationWorkspaceService,
        DailyCalibrationMap,
        {
          provide: DailyCalibrationWorkspaceRepository,
          useValue: dailyCalibrationRepositoryMock,
        },
        {
          provide: BulkLoadService,
          useFactory: () => ({
            startBulkLoader: jest.fn().mockResolvedValue({
              writeObject: writeObjectMock,
              complete: jest.fn(),
              finished: true,
            }),
          }),
        },
      ],
    }).compile();

    dailyCalibrationService = module.get(DailyCalibrationWorkspaceService);
  });

  it('should have a daily calibration service', function() {
    expect(dailyCalibrationService).toBeDefined();
  });

  it('should delete a record', async function() {
    await expect(dailyCalibrationService.delete('-10')).resolves.toEqual(
      undefined,
    );
  });

  // it('should mock import of 3 new records', async function() {
  //   const params = [
  //     new DailyCalibrationImportDTO(),
  //     new DailyCalibrationImportDTO(),
  //     new DailyCalibrationImportDTO(),
  //   ];

  //   await dailyCalibrationService.import(params, '', 1, {
  //     components: {},
  //     monitorFormulas: {},
  //     monitoringSystems: {},
  //     userId: '',
  //   });

  //   expect(writeObjectMock).toHaveBeenCalledTimes(3);
  // });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager, QueryRunner } from 'typeorm';

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

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    query: jest.fn(),
  },
};

const mockEntityManager = {
  connection: {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  },
  transaction: jest.fn().mockImplementation(async (fn) => {
    return await fn(mockQueryRunner.manager);
  }),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  query: jest.fn(),
};

describe('Daily Calibration Workspace Service', () => {
  let dailyCalibrationService: DailyCalibrationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyCalibrationWorkspaceService,
        DailyCalibrationMap,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: DailyCalibrationWorkspaceRepository,
          useValue: dailyCalibrationRepositoryMock,
        },
        {
          provide: BulkLoadService,
          useFactory: () => ({
            startBulkLoader: jest.fn().mockImplementation(
                (_tableLocation, _columns, _delimiter, _queryRunner) => {
                  return {
                    writeObject: writeObjectMock,
                    complete: jest.fn(),
                    finished: Promise.resolve(true),
                    status: 'Complete',
                  };
                }
            ),
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

  it('should mock import of 3 new records', async function() {
    const params = [
      new DailyCalibrationImportDTO(),
      new DailyCalibrationImportDTO(),
      new DailyCalibrationImportDTO(),
    ];

    await dailyCalibrationService.import(params, '', 1, {
      components: {},
      monitorFormulas: {},
      monitoringSystems: {},
      userId: '',
    });

    expect(writeObjectMock).toHaveBeenCalledTimes(3);
  });
});

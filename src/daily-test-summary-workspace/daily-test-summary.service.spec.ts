import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyTestSummaryWorkspaceService } from './daily-test-summary.service';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { DailyCalibrationWorkspaceRepository } from '../daily-calibration-workspace/daily-calibration.repository';
import { mockDailyTestSummaryWorkspaceRepository } from '../../test/mocks/mock-daily-test-summary-workspace-repository';
import { genDailyTestSummary } from '../../test/object-generators/daily-test-summary';
import { DailyTestSummary } from '../entities/workspace/daily-test-summary.entity';
import { mockDailyCalibrationWorkspaceRepository } from '../../test/mocks/mock-daily-calibration-workspace-repository';
import { genEmissionsParamsDto } from '../../test/object-generators/emissions-dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { DailyTestSummaryImportDTO } from '../dto/daily-test-summary.dto';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';

const writeObjectMock = jest.fn();

describe('Daily Summary Workspace Service', () => {
  let dailyCalibrationWorkspaceRepository: DailyCalibrationWorkspaceRepository;
  let dailyTestSummaryService: DailyTestSummaryWorkspaceService;
  let map: DailyTestSummaryMap;
  let repository: DailyTestSummaryWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyTestSummaryWorkspaceService,
        DailyCalibrationWorkspaceService,
        DailyTestSummaryMap,
        DailyCalibrationMap,
        {
          provide: DailyTestSummaryWorkspaceRepository,
          useValue: mockDailyTestSummaryWorkspaceRepository,
        },
        {
          provide: DailyCalibrationWorkspaceRepository,
          useValue: mockDailyCalibrationWorkspaceRepository,
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

    dailyTestSummaryService = module.get(DailyTestSummaryWorkspaceService);
    map = module.get(DailyTestSummaryMap);
    repository = module.get(DailyTestSummaryWorkspaceRepository);
    dailyCalibrationWorkspaceRepository = module.get(
      DailyCalibrationWorkspaceRepository,
    );
  });

  it('should have a daily test summary service', function() {
    expect(dailyTestSummaryService).toBeDefined();
  });

  it('should get daily test summaries by location ids', async function() {
    const mockedValues = genDailyTestSummary<DailyTestSummary>(3, {
      include: ['monitorLocation'],
    });
    const promises = [];
    mockedValues.forEach(value => {
      promises.push(map.one(value));
    });
    const mappedValues = await Promise.all(promises);

    jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

    await expect(
      dailyTestSummaryService.getDailyTestSummariesByLocationIds(
        mockedValues.map(value => {
          return value.monitorLocation.id;
        }),
        genEmissionsParamsDto()[0],
      ),
    ).resolves.toEqual(mappedValues);
  });

  it('should delete a record', async function() {
    await expect(
      dailyTestSummaryService.delete({
        monitoringLocationId: '123',
        reportingPeriodId: 2,
      }),
    ).resolves.toEqual(undefined);
  });

  it('should export mapped data', async function() {
    const dailyTestSummaryMocks = genDailyTestSummary<DailyTestSummary>(3);
    const mappedValues = await map.many(dailyTestSummaryMocks);

    jest.spyOn(repository, 'export').mockResolvedValue(dailyTestSummaryMocks);
    jest
      .spyOn(dailyCalibrationWorkspaceRepository, 'find')
      .mockResolvedValue(null);

    await expect(
      dailyTestSummaryService.export([], genEmissionsParamsDto()[0]),
    ).resolves.toEqual(mappedValues);
  });

  it('should successfully import', async function() {
    const emissionsDto = new EmissionsImportDTO();
    const dto1 = new DailyTestSummaryImportDTO();
    dto1.unitId = '3';
    dto1.stackPipeId = null;
    const dto2 = new DailyTestSummaryImportDTO();
    dto2.unitId = null;
    dto2.stackPipeId = 'CS1';
    const dto3 = new DailyTestSummaryImportDTO();
    dto3.unitId = '4';
    dto3.stackPipeId = 'CS2';
    emissionsDto.dailyTestSummaryData = [dto1, dto2, dto3];

    const identifiers = { locations: {}, userId: '' };
    const mockLocations = [
      { id: 'LOC1', unit: { name: '3' }, stackPipe: null },
      { id: 'LOC2', unit: null, stackPipe: { name: 'CS1' } },
      { id: 'LOC3', unit: { name: '4' }, stackPipe: { name: 'CS2' } },
    ];
    const monitoringLocationId = faker.datatype.string();
    identifiers.locations[monitoringLocationId] = { components: {}, monitorFormulas: {}, monitoringSystems: {} };

    await dailyTestSummaryService.import(
      emissionsDto,
      mockLocations,
      1,
      identifiers,
      new Date().toISOString(),
    );

    expect(writeObjectMock).toHaveBeenCalledTimes(3);
    });

  // Location lookup with anyOf schema compliance
  describe('Location Lookup - anyOf Schema Compliance', () => {
    const mockLocations = [
      {
        id: 'LOC1',
        unit: { name: '3' },
        stackPipe: null
      },
      {
        id: 'LOC2',
        unit: null,
        stackPipe: { name: 'CS1' }
      },
      {
        id: 'LOC3',
        unit: { name: '4' },
        stackPipe: { name: 'CS2' }
      },
    ];

    const mockEmissionsImport = {
      dailyTestSummaryData: []
    };

    it('should find location with unitId only', async () => {
      const dailyTestSummaryData = [
        { unitId: '3', stackPipeId: null, testTypeCode: 'RATA' }
      ];

      mockEmissionsImport.dailyTestSummaryData = dailyTestSummaryData;

      const identifiers = {
        userId: 'testUser',
        locations: {
          'LOC1': {
            components: {},
            monitorFormulas: {},
            monitoringSystems: {}
          }
        }
      };
      // Should not throw error for valid unitId-only location
      await expect(dailyTestSummaryService.import(
        mockEmissionsImport as EmissionsImportDTO,
        mockLocations as any,
        1, // reportingPeriodId
        identifiers as any, // identifiers
        '2023-01-01T00:00:00Z' // currentTime
      )).resolves.not.toThrow();
    });

    it('should find location with stackPipeId only', async () => {
      const dailyTestSummaryData = [
        { unitId: null, stackPipeId: 'CS1', testTypeCode: 'RATA' }
      ];

      mockEmissionsImport.dailyTestSummaryData = dailyTestSummaryData;

      const identifiers = {
        userId: 'testUser',
        locations: {
          'LOC2': {
            components: {},
            monitorFormulas: {},
            monitoringSystems: {}
          }
        }
      };

      // Should not throw error for valid stackPipeId-only location
      await expect(dailyTestSummaryService.import(
        mockEmissionsImport as EmissionsImportDTO,
        mockLocations as any,
        1, // reportingPeriodId
        identifiers as any, // identifiers
        '2023-01-01T00:00:00Z' // currentTime
      )).resolves.not.toThrow();
    });

    it('should find location with both identifiers', async () => {
      const dailyTestSummaryData = [
        { unitId: '4', stackPipeId: 'CS2', testTypeCode: 'RATA' }
      ];

      mockEmissionsImport.dailyTestSummaryData = dailyTestSummaryData;

      const identifiers = {
        userId: 'testUser',
        locations: {
          'LOC3': {
            components: {},
            monitorFormulas: {},
            monitoringSystems: {}
          }
        }
      };

      // Should not throw error for valid both identifiers location
      await expect(dailyTestSummaryService.import(
        mockEmissionsImport as EmissionsImportDTO,
        mockLocations as any,
        1, // reportingPeriodId
        identifiers as any, // identifiers
        '2023-01-01T00:00:00Z' // currentTime
      )).resolves.not.toThrow();
    });

    it('should throw error when no location found', async () => {
      const dailyTestSummaryData = [
        { unitId: 'NOMATCH', stackPipeId: null, testTypeCode: 'RATA' }
      ];

      mockEmissionsImport.dailyTestSummaryData = dailyTestSummaryData;

      const identifiers = {
        userId: 'testUser',
        locations: {}
      };

      await expect(
        dailyTestSummaryService.import(
          mockEmissionsImport as EmissionsImportDTO,
          mockLocations as any,
          1,
          identifiers as any,
          '2023-01-01T00:00:00Z'
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when multiple locations found', async () => {
      const ambiguousLocations = [
        { id: 'LOC1', unit: { name: '3' }, stackPipe: null },
        { id: 'LOC2', unit: { name: '3' }, stackPipe: null },
      ];

      const dailyTestSummaryData = [
        { unitId: '3', stackPipeId: null, testTypeCode: 'RATA' }
      ];

      mockEmissionsImport.dailyTestSummaryData = dailyTestSummaryData;

      const identifiers = {
        userId: 'testUser',
        locations: {}
      };

      await expect(
        dailyTestSummaryService.import(
          mockEmissionsImport as EmissionsImportDTO,
          ambiguousLocations as any,
          1,
          { userId: 'testUser' } as any,
          '2023-01-01T00:00:00Z'
        )
      ).rejects.toThrow(BadRequestException);
    });
  });
});

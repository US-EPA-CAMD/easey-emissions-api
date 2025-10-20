import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { mockWeeklyTestSummaryWorkspaceRepository } from '../../test/mocks/mock-weekly-test-summary-workspace-repository';
import { genWeeklyTestSumValues } from '../../test/object-generators/weekly-test-summary';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { WeeklyTestSummary } from '../entities/workspace/weekly-test-summary.entity';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklySystemIntegrityWorkspaceRepository } from '../weekly-system-integrity-workspace/weekly-system-integrity.repository';
import { WeeklySystemIntegrityWorkspaceService } from '../weekly-system-integrity-workspace/weekly-system-integrity.service';
import { WeeklyTestSummaryWorkspaceRepository } from './weekly-test-summary.repository';
import { WeeklyTestSummaryWorkspaceService } from './weekly-test-summary.service';
import { WeeklyTestSummaryImportDTO } from '../dto/weekly-test-summary.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';

const writeObjectMock = jest.fn();

// Mock child service with all required methods
const mockWeeklySystemIntegrityService = {
  export: jest.fn().mockResolvedValue([]),
  buildObjectList: jest.fn().mockResolvedValue([]),
  import: jest.fn().mockResolvedValue(undefined),
};

describe('--WeeklyTestSummaryWorkspaceService--', () => {
  let map: WeeklyTestSummaryMap;
  let repository: WeeklyTestSummaryWorkspaceRepository;
  let weeklySystemIntegrityService: WeeklySystemIntegrityWorkspaceService;
  let service: WeeklyTestSummaryWorkspaceService;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WeeklyTestSummaryWorkspaceService,
        WeeklyTestSummaryMap,
        ConfigService,
        {
          provide: BulkLoadService,
          useFactory: () => ({
            startBulkLoader: jest.fn().mockResolvedValue({
              writeObject: writeObjectMock,
              complete: jest.fn(),
              finished: Promise.resolve(true),
              status: 'Complete',
            }),
          }),
        },
        {
          provide: WeeklyTestSummaryWorkspaceRepository,
          useValue: mockWeeklyTestSummaryWorkspaceRepository,
        },
        {
          provide: WeeklySystemIntegrityWorkspaceService,
          useValue: mockWeeklySystemIntegrityService,
        },
      ],
    }).compile();

    map = module.get(WeeklyTestSummaryMap);
    repository = module.get(WeeklyTestSummaryWorkspaceRepository);
    service = module.get(WeeklyTestSummaryWorkspaceService);
    bulkLoadService = module.get(BulkLoadService);
    weeklySystemIntegrityService = module.get(
      WeeklySystemIntegrityWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('export', () => {
    it('returns export record for weekly test summary data', async () => {
      const mockedValues = genWeeklyTestSumValues<WeeklyTestSummary>(3, {
        include: ['weeklySystemIntegrityData'],
      });
      const promises = [];
      const params = new EmissionsParamsDTO();
      mockedValues.forEach(value => {
        promises.push(map.one(value));
      });
      const mappedValues = await Promise.all(promises);
      jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);
      jest
        .spyOn(weeklySystemIntegrityService, 'export')
        .mockResolvedValue(undefined);

      await expect(
        service.export(
          mockedValues.map(value => {
            return value.id;
          }),
          params,
        ),
      ).resolves.toEqual(mappedValues);
    });
  });

  describe('import', () => {
    it('should successfully import a weekly test summary record', async () => {
      const generatedData = genWeeklyTestSumValues<WeeklyTestSummary>(1, {
        include: ['weeklySystemIntegrityData'],
      });
      const importData = await map.many(generatedData);

      // @ts-expect-error use as mock
      jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
        writeObject: jest.fn(),
        complete: jest.fn(),
        finished: Promise.resolve(true),
      });

      jest
        .spyOn(weeklySystemIntegrityService, 'import')
        .mockResolvedValue(null);
      const emissionsDto = new EmissionsImportDTO();
      emissionsDto.weeklyTestSummaryData = importData;

      const locations = [{ unit: { name: 'a' }, id: 1 }];
      importData[0].unitId = 'a';
      const identifiers = { locations: {}, userId: '' };
      const monitoringLocationId = faker.datatype.string();
      identifiers.locations[monitoringLocationId] = {
        components: {},
        monitorFormulas: {},
        monitoringSystems: {},
      };

      await expect(service.import(emissionsDto, locations, '', identifiers, ''))
        .resolves;
       });
  });

  // TT6932 Tests: Location lookup with anyOf schema compliance
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
    ] as MonitorLocation[];

    it('should find location with unitId only', async () => {
      const dto = new EmissionsImportDTO();
      dto.weeklyTestSummaryData = [
        {
          unitId: '3',
          stackPipeId: null,
          date: new Date('2023-01-01'),
          hour: 1,
          monitoringSystemId: 'SYS1',
          componentId: 'COMP1',
          testTypeCode: 'LINEARITY',
          testResultCode: 'PASSED',
          spanScaleCode: 'H',
          weeklySystemIntegrityData: [],
        } as WeeklyTestSummaryImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid unitId-only location
      await expect(
        service.import(dto, mockLocations, '1', identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should find location with stackPipeId only', async () => {
      const dto = new EmissionsImportDTO();
      dto.weeklyTestSummaryData = [
        {
          unitId: null,
          stackPipeId: 'CS1',
          date: new Date('2023-01-01'),
          hour: 1,
          monitoringSystemId: 'SYS1',
          componentId: 'COMP1',
          testTypeCode: 'LINEARITY',
          testResultCode: 'PASSED',
          spanScaleCode: 'H',
          weeklySystemIntegrityData: [],
        } as WeeklyTestSummaryImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid stackPipeId-only location
      await expect(
        service.import(dto, mockLocations, '1', identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should find location with both identifiers', async () => {
      const dto = new EmissionsImportDTO();
      dto.weeklyTestSummaryData = [
        {
          unitId: '4',
          stackPipeId: 'CS2',
          date: new Date('2023-01-01'),
          hour: 1,
          monitoringSystemId: 'SYS1',
          componentId: 'COMP1',
          testTypeCode: 'LINEARITY',
          testResultCode: 'PASSED',
          spanScaleCode: 'H',
          weeklySystemIntegrityData: [],
        } as WeeklyTestSummaryImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid both identifiers location
      await expect(
        service.import(dto, mockLocations, '1', identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should throw error when no location found', async () => {
      const dto = new EmissionsImportDTO();
      dto.weeklyTestSummaryData = [
        {
          unitId: '999',
          stackPipeId: null,
          date: new Date('2023-01-01'),
          hour: 1,
          monitoringSystemId: 'SYS1',
          componentId: 'COMP1',
          testTypeCode: 'LINEARITY',
          testResultCode: 'PASSED',
          spanScaleCode: 'H',
          weeklySystemIntegrityData: [],
        } as WeeklyTestSummaryImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      await expect(
        service.import(dto, mockLocations, '1', identifiers, new Date().toISOString())
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when multiple locations found', async () => {
      const ambiguousLocations = [
        { id: 'LOC1', unit: { name: '3' }, stackPipe: null },
        { id: 'LOC2', unit: { name: '3' }, stackPipe: null }, // Duplicate unit
      ] as MonitorLocation[];

      const dto = new EmissionsImportDTO();
      dto.weeklyTestSummaryData = [
        {
          unitId: '3',
          stackPipeId: null,
          date: new Date('2023-01-01'),
          hour: 1,
          monitoringSystemId: 'SYS1',
          componentId: 'COMP1',
          testTypeCode: 'LINEARITY',
          testResultCode: 'PASSED',
          spanScaleCode: 'H',
          weeklySystemIntegrityData: [],
        } as WeeklyTestSummaryImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      await expect(
        service.import(dto, ambiguousLocations, '1', identifiers, new Date().toISOString())
      ).rejects.toThrow(BadRequestException);
    });
  });
});

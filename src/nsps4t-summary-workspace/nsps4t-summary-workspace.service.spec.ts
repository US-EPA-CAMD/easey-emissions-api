import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { genNsps4tSummary } from '../../test/object-generators/nsps4t-summary';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { Nsps4tSummaryImportDTO } from '../dto/nsps4t-summary.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { Nsps4tSummary } from '../entities/workspace/nsps4t-summary.entity';
import { Nsps4tSummaryMap } from '../maps/nsps4t-summary.map';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import * as exportNsps4tSummaryData from '../nsps4t-summary-functions/export-nsps4t-summary-data';
import { Nsps4tSummaryWorkspaceRepository } from './nsps4t-summary-workspace.repository';
import { Nsps4tSummaryWorkspaceService } from './nsps4t-summary-workspace.service';

const writeObjectMock = jest.fn();

// Mock child services with all required methods
const mockNsps4tAnnualService = {
  export: jest.fn().mockResolvedValue([]),
  buildObjectList: jest.fn().mockResolvedValue([]),
  import: jest.fn().mockResolvedValue(undefined),
};

const mockNsps4tCompliancePeriodService = {
  export: jest.fn().mockResolvedValue([]),
  buildObjectList: jest.fn().mockResolvedValue([]),
  import: jest.fn().mockResolvedValue(undefined),
};

describe('Nsps4tSummaryWorkspaceNewService', () => {
  let service: Nsps4tSummaryWorkspaceService;
  let repository: Nsps4tSummaryWorkspaceRepository;
  let annualService: Nsps4tAnnualWorkspaceService;
  let compliancePeriodService: Nsps4tCompliancePeriodWorkspaceService;
  let map: Nsps4tSummaryMap;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
        Nsps4tAnnualWorkspaceRepository,
        Nsps4tCompliancePeriodWorkspaceRepository,
        Nsps4tSummaryWorkspaceRepository,
        Nsps4tSummaryWorkspaceService,
        Nsps4tSummaryMap,
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
          provide: Nsps4tAnnualWorkspaceService,
          useValue: mockNsps4tAnnualService,
        },
        {
          provide: Nsps4tCompliancePeriodWorkspaceService,
          useValue: mockNsps4tCompliancePeriodService,
        },
      ],
    }).compile();

    service = module.get<Nsps4tSummaryWorkspaceService>(
      Nsps4tSummaryWorkspaceService,
    );
    repository = module.get(Nsps4tSummaryWorkspaceRepository);
    annualService = module.get(Nsps4tAnnualWorkspaceService);
    compliancePeriodService = module.get(
      Nsps4tCompliancePeriodWorkspaceService,
    );
    map = module.get(Nsps4tSummaryMap);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export mapped data', async () => {
    const nsps4tSummaryMock = genNsps4tSummary<Nsps4tSummary>();
    const mappedValues = await map.many(nsps4tSummaryMock);

    jest
      .spyOn(exportNsps4tSummaryData, 'exportNsps4tSummaryData')
      .mockResolvedValue(mappedValues);

    await expect(service.export([], new EmissionsParamsDTO())).resolves.toEqual(
      mappedValues,
    );
  });

  it('should successfully import', async function() {
    const entityMocks = genNsps4tSummary<Nsps4tSummary>(1, {
      include: ['nsps4tAnnualData', 'nsps4tCompliancePeriodData'],
      nsps4tCompliancePeriodDataAmount: 1,
      nsps4tAnnualDataAmount: 1,
    });
    const nsps4tSummaryData = await map.many(entityMocks);

    const emissionsDto = new EmissionsImportDTO();
    emissionsDto.nsps4tSummaryData = nsps4tSummaryData;

    // MonitorLocation objects with valid structure
    const locations = [{ unit: { name: '1' }, id: '1', stackPipe: null }];

    nsps4tSummaryData[0].unitId = '1';
    nsps4tSummaryData[0].stackPipeId = null;
    const identifiers = { locations: {}, userId: '' };
    const monitoringLocationId = faker.datatype.string();
    identifiers.locations[monitoringLocationId] = {
      components: {},
      monitorFormulas: {},
      monitoringSystems: {},
    };

    await expect(
      service.import(emissionsDto, locations, 1, identifiers, '2019-01-01'),
    ).resolves.not.toThrow();
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
    ] as MonitorLocation[];

    it('should find location with unitId only', async () => {
      const dto = new EmissionsImportDTO();
      dto.nsps4tSummaryData = [
        {
          unitId: '3',
          stackPipeId: null,
          co2EmissionStandardCode: 'STANDARD1',
          nsps4tFourthQuarterData: [],
          nsps4tCompliancePeriodData: [],
        } as Nsps4tSummaryImportDTO,
      ];

    const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid unitId-only location
      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should find location with stackPipeId only', async () => {
      const dto = new EmissionsImportDTO();
      dto.nsps4tSummaryData = [
        {
          unitId: null,
          stackPipeId: 'CS1',
          co2EmissionStandardCode: 'STANDARD1',
          nsps4tFourthQuarterData: [],
          nsps4tCompliancePeriodData: [],
        } as Nsps4tSummaryImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid stackPipeId-only location
      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should find location with both identifiers', async () => {
      const dto = new EmissionsImportDTO();
      dto.nsps4tSummaryData = [
        {
          unitId: '4',
          stackPipeId: 'CS2',
          co2EmissionStandardCode: 'STANDARD1',
          nsps4tFourthQuarterData: [],
          nsps4tCompliancePeriodData: [],
        } as Nsps4tSummaryImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid both identifiers location
      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should throw error when no location found', async() => {
      const dto = new EmissionsImportDTO();
      dto.nsps4tSummaryData = [
        {
          unitId: '999',
          stackPipeId: null,
          co2EmissionStandardCode: 'STANDARD1',
          nsps4tFourthQuarterData: [],
          nsps4tCompliancePeriodData: [],
        } as Nsps4tSummaryImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when multiple locations found', async() => {
      const ambiguousLocations = [
        { id: 'LOC1', unit: { name: '3' }, stackPipe: null },
        { id: 'LOC2', unit: { name: '3' }, stackPipe: null }, // Duplicate unit
      ] as MonitorLocation[];

      const dto = new EmissionsImportDTO();
      dto.nsps4tSummaryData = [
        {
          unitId: '3',
          stackPipeId: null,
          co2EmissionStandardCode: 'STANDARD1',
          nsps4tFourthQuarterData: [],
          nsps4tCompliancePeriodData: [],
        } as Nsps4tSummaryImportDTO,
      ];

     const identifiers = { locations: {}, userId: 'test-user' };

      await expect(
        service.import(dto, ambiguousLocations, 1, identifiers, new Date().toISOString())
      ).rejects.toThrow(BadRequestException);
    });
  });
});

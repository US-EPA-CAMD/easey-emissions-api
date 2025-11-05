import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { genSorbentTrap } from '../../test/object-generators/sorbent-trap';
import { ComponentRepository } from '../component/component.repository';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { SorbentTrapImportDTO } from '../dto/sorbent-trap.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { SorbentTrap } from '../entities/workspace/sorbent-trap.entity';
import { SorbentTrapMap } from '../maps/sorbent-trap.map';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import * as exportSorbentTrapData from '../sorbent-trap-functions/export-sorbent-trap-data';
import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';
import { SorbentTrapWorkspaceService } from './sorbent-trap-workspace.service';

const writeObjectMock = jest.fn();

// Mock child service with all required methods
const mockSamplingTrainService = {
  export: jest.fn().mockResolvedValue([]),
  buildObjectList: jest.fn().mockResolvedValue([]),
  import: jest.fn().mockResolvedValue(undefined),
};

describe('SorbentTrapWorkspaceService', () => {
  let service: SorbentTrapWorkspaceService;
  let samplingTrainService: SamplingTrainWorkspaceService;
  let map: SorbentTrapMap;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SorbentTrapWorkspaceService,
        SorbentTrapMap,
        {
          provide: SorbentTrapWorkspaceRepository,
          useValue: {
            delete: jest.fn(),
          },
        },
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
          provide: SamplingTrainWorkspaceService,
          useValue: mockSamplingTrainService,
        },
      ],
    }).compile();

    service = module.get<SorbentTrapWorkspaceService>(
      SorbentTrapWorkspaceService,
    );
    samplingTrainService = module.get(SamplingTrainWorkspaceService);
    map = module.get(SorbentTrapMap);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export data', async () => {
    const mockedValues = genSorbentTrap<SorbentTrap>(1, {
      include: ['samplingTrains'],
      samplingTrainAmount: 1,
    });
    const mappedValues = await map.many(mockedValues);

    jest
      .spyOn(exportSorbentTrapData, 'exportSorbentTrapData')
      .mockResolvedValue(mappedValues);
    jest
      .spyOn(samplingTrainService, 'export')
      .mockResolvedValue(mappedValues[0].samplingTrainData);

    await expect(service.export([], new EmissionsParamsDTO())).resolves.toEqual(
      mappedValues,
    );
  });

  it('should successfully import', async function() {
    const mockedValues = genSorbentTrap<SorbentTrap>(1, {
      include: ['samplingTrains'],
      samplingTrainAmount: 1,
    });
    const sorbentTrapData = await map.many(mockedValues);

    //@ts-expect-error as mock
    jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
      writeObject: jest.fn(),
      complete: jest.fn(),
      finished: Promise.resolve(true),
    });
    const emissionsDto = new EmissionsImportDTO();
    emissionsDto.sorbentTrapData = sorbentTrapData;

    const locations = [{ unit: { name: '1' }, id: 1 }];

    sorbentTrapData[0].unitId = '1';
    const identifiers = { locations: {}, userId: '' };
    const monitoringLocationId = faker.datatype.string();
    identifiers.locations[monitoringLocationId] = {
      components: {},
      monitorFormulas: {},
      monitoringSystems: {},
    };

    await expect(
      service.import(emissionsDto, locations, '1', identifiers, '2019-01-01'),
    ).resolves;
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
      dto.sorbentTrapData = [
        {
          unitId: '3',
          stackPipeId: null,
          beginDate: new Date('2023-01-01'),
          beginHour: 0,
          endDate: new Date('2023-01-01'),
          endHour: 23,
          monitoringSystemId: 'SYS1',
          samplingTrainData: [],
        } as SorbentTrapImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid unitId-only location
      await expect(
        service.import(dto, mockLocations, '1', identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should find location with stackPipeId only', async () => {
      const dto = new EmissionsImportDTO();
      dto.sorbentTrapData = [
        {
          unitId: null,
          stackPipeId: 'CS1',
          beginDate: new Date('2023-01-01'),
          beginHour: 0,
          endDate: new Date('2023-01-01'),
          endHour: 23,
          monitoringSystemId: 'SYS1',
          samplingTrainData: [],
        } as SorbentTrapImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid stackPipeId-only location
      await expect(
        service.import(dto, mockLocations, '1', identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should find location with both identifiers', async () => {
      const dto = new EmissionsImportDTO();
      dto.sorbentTrapData = [
        {
          unitId: '4',
          stackPipeId: 'CS2',
          beginDate: new Date('2023-01-01'),
          beginHour: 0,
          endDate: new Date('2023-01-01'),
          endHour: 23,
          monitoringSystemId: 'SYS1',
          samplingTrainData: [],
        } as SorbentTrapImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid both identifiers location
      await expect(
        service.import(dto, mockLocations, '1', identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should throw error when no location found', async () => {
      const dto = new EmissionsImportDTO();
      dto.sorbentTrapData = [
        {
          unitId: '999',
          stackPipeId: null,
          beginDate: new Date('2023-01-01'),
          beginHour: 0,
          endDate: new Date('2023-01-01'),
          endHour: 23,
          monitoringSystemId: 'SYS1',
          samplingTrainData: [],
        } as SorbentTrapImportDTO,
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
      dto.sorbentTrapData = [
        {
          unitId: '3',
          stackPipeId: null,
          beginDate: new Date('2023-01-01'),
          beginHour: 0,
          endDate: new Date('2023-01-01'),
          endHour: 23,
          monitoringSystemId: 'SYS1',
          samplingTrainData: [],
        } as SorbentTrapImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      await expect(
        service.import(dto, ambiguousLocations, '1', identifiers, new Date().toISOString())
      ).rejects.toThrow(BadRequestException);
    });
  });
});

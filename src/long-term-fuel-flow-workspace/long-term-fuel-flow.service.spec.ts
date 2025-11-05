import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';

import { mockLongTermFuelFlowWorkspaceRepository } from '../../test/mocks/mock-long-term-fuel-flow-workspace-repository';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from './long-term-fuel-flow.service';
import { LongTermFuelFlow } from '../entities/workspace/long-term-fuel-flow.entity';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { genLongTermFuelFlow } from '../../test/object-generators/long-term-fuel-flow';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { ConfigService } from '@nestjs/config';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { LongTermFuelFlowImportDTO } from '../dto/long-term-fuel-flow.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

const writeObjectMock = jest.fn();

describe('--LongTermFuelFlowWorkspaceService--', () => {
  let repository: LongTermFuelFlowWorkspaceRepository;
  let service: LongTermFuelFlowWorkspaceService;
  let bulkLoadService: BulkLoadService;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LongTermFuelFlowWorkspaceService,
        LongTermFuelFlowMap,
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
          provide: LongTermFuelFlowWorkspaceRepository,
          useValue: mockLongTermFuelFlowWorkspaceRepository,
        },
      ],
    }).compile();

    repository = module.get(LongTermFuelFlowWorkspaceRepository);
    service = module.get(LongTermFuelFlowWorkspaceService);
    map = module.get(LongTermFuelFlowMap);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should successfully import', async () => {
    const mockedData = genLongTermFuelFlow<LongTermFuelFlow>(1);
    const longTermFuelFlow = await map.many(mockedData);

    const emissionsDto = new EmissionsImportDTO();
    emissionsDto.longTermFuelFlowData = longTermFuelFlow;

    // MonitorLocation objects with valid structure
    const locations = [{ unit: { name: '1' }, id: '1', stackPipe: null }];

    longTermFuelFlow[0].unitId = '1';
    longTermFuelFlow[0].stackPipeId = null;
    const identifiers = { locations: {}, userId: '' };
    const monitoringLocationId = faker.datatype.string();
    identifiers.locations[monitoringLocationId] = { components: {}, monitorFormulas: {}, monitoringSystems: {} };

    await expect(
      service.import(emissionsDto, locations, 1, identifiers, '2019-01-01'),
    ).resolves.not.toThrow();
  });
  it('should get long term fuel flow by location ids', async function () {
    const genLongTermFuelFlowValues = genLongTermFuelFlow<LongTermFuelFlow>(1);
    const promises = [];
    genLongTermFuelFlowValues.forEach(value => {
      promises.push(map.one(value));
    });
    const mappedValues = await Promise.all(promises);
    const params = new EmissionsParamsDTO();

    jest
      .spyOn(repository, 'export')
      .mockResolvedValue(genLongTermFuelFlowValues as LongTermFuelFlow[]);

    const result = await service.export(
      genLongTermFuelFlowValues.map(value => value.monitoringLocationId),
      params,
    );
    expect(result).toEqual(mappedValues);
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
      dto.longTermFuelFlowData = [
        {
          unitId: '3',
          stackPipeId: null,
          monitoringSystemId: 'SYS1',
          fuelFlowPeriodCode: 'Q1',
          longTermFuelFlowValue: 100,
        } as LongTermFuelFlowImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid unitId-only location
      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should find location with stackPipeId only', async () => {
      const dto = new EmissionsImportDTO();
      dto.longTermFuelFlowData = [
        {
          unitId: null,
          stackPipeId: 'CS1',
          monitoringSystemId: 'SYS1',
          fuelFlowPeriodCode: 'Q1',
          longTermFuelFlowValue: 100,
        } as LongTermFuelFlowImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid stackPipeId-only location
      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should find location with both identifiers', async () => {
      const dto = new EmissionsImportDTO();
      dto.longTermFuelFlowData = [
        {
          unitId: '4',
          stackPipeId: 'CS2',
          monitoringSystemId: 'SYS1',
          fuelFlowPeriodCode: 'Q1',
          longTermFuelFlowValue: 100,
        } as LongTermFuelFlowImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid both identifiers location
      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should throw error when no location found', async () => {
      const dto = new EmissionsImportDTO();
      dto.longTermFuelFlowData = [
        {
          unitId: '999',
          stackPipeId: null,
          monitoringSystemId: 'SYS1',
          fuelFlowPeriodCode: 'Q1',
          longTermFuelFlowValue: 100,
        } as LongTermFuelFlowImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when multiple locations found', async () => {
      const ambiguousLocations = [
        { id: 'LOC1', unit: { name: '3' }, stackPipe: null },
        { id: 'LOC2', unit: { name: '3' }, stackPipe: null }, // Duplicate unit
      ] as MonitorLocation[];

      const dto = new EmissionsImportDTO();
      dto.longTermFuelFlowData = [
        {
          unitId: '3',
          stackPipeId: null,
          monitoringSystemId: 'SYS1',
          fuelFlowPeriodCode: 'Q1',
          longTermFuelFlowValue: 100,
        } as LongTermFuelFlowImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      await expect(
        service.import(dto, ambiguousLocations, 1, identifiers, new Date().toISOString())
      ).rejects.toThrow(BadRequestException);
    });
  });
});

import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { genDailyEmission } from '../../test/object-generators/daily-emission';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyEmissionDTO } from '../dto/daily-emission.dto';
import { DailyFuelDTO } from '../dto/daily-fuel.dto';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyEmission } from '../entities/workspace/daily-emission.entity';
import { DailyFuel } from '../entities/workspace/daily-fuel.entity';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { DailyEmissionWorkspaceService } from './daily-emission-workspace.service';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

describe('DailyEmissionWorkspaceService', () => {
  let map: DailyEmissionMap;
  let service: DailyEmissionWorkspaceService;
  let repository: DailyEmissionWorkspaceRepository;
  let bulkLoadService: BulkLoadService;
  let exportModule: typeof import('../daily-emission-functions/export-daily-emission-data');

  const mockDailyFuelWorkspaceService = {
    export: () => Promise.resolve([new DailyFuelDTO()]),
    import: () => Promise.resolve([new DailyFuel()]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyFuelMap,
        DailyEmissionMap,
        DailyEmissionWorkspaceService,
        DailyEmissionWorkspaceRepository,
        DailyFuelWorkspaceRepository,
        EntityManager,
        BulkLoadService,
        ConfigService,
        {
          provide: DailyFuelWorkspaceService,
          useValue: mockDailyFuelWorkspaceService,
        },
      ],
    }).compile();

    service = module.get<DailyEmissionWorkspaceService>(
      DailyEmissionWorkspaceService,
    );
    repository = module.get(DailyEmissionWorkspaceRepository);
    map = module.get(DailyEmissionMap);

    bulkLoadService = module.get(BulkLoadService);
    exportModule = await import(
      '../daily-emission-functions/export-daily-emission-data'
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('import', () => {
    it('should import a record', async function() {
      const dailyEmission = genDailyEmission<DailyEmission>(1, {
        include: ['dailyFuelData'],
      });
      const importData = await map.many(dailyEmission);

      // @ts-expect-error use as mock
      jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
        writeObject: jest.fn(),
        complete: jest.fn(),
        finished: Promise.resolve(true),
      });

      const emissionsDto = new EmissionsImportDTO();
      emissionsDto.dailyEmissionData = importData;

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

      //   await expect(
      //     service.import({
      //       ...dailyEmission,
      //       reportingPeriodId: faker.datatype.number(),
      //       monitoringLocationId: faker.datatype.string(),
      //       identifiers: {
      //         components: {},
      //         monitorFormulas: {},
      //         monitoringSystems: {},
      //       },
      //     }),
      //   ).resolves.toEqual(dailyEmission);
    });
  });

  describe('export', () => {
    it('should successfully export', async () => {
      jest
        .spyOn(exportModule, 'exportDailyEmissionData')
        .mockResolvedValue([new DailyEmissionDTO()]);
      const result = await service.export([], new EmissionsParamsDTO());

      expect(result.length).toEqual(1);
      expect(result[0].dailyFuelData.length).toEqual(1);
       });
  });

  // Test location lookup with anyOf schema compliance
  describe('Location Lookup - anyOf Schema Compliance', () => {
    beforeEach(() => {
      // Mock bulkLoadService to prevent database connections in TT6932 tests
      jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
        writeObject: jest.fn(),
        complete: jest.fn().mockResolvedValue(undefined),
      } as any);
    });
    const mockLocations = [
      { id: 'LOC1', unit: { name: '3' }, stackPipe: null },
      { id: 'LOC2', unit: null, stackPipe: { name: 'CS1' } },
      { id: 'LOC3', unit: { name: '4' }, stackPipe: { name: 'CS2' } },
    ];

    const mockEmissionsImport = {
      dailyEmissionData: []
    };

    it('should find location with unitId only', async () => {
      const dailyEmissionData = [
        { unitId: '3', stackPipeId: null, parameterCode: 'CO2' }
      ];

      mockEmissionsImport.dailyEmissionData = dailyEmissionData;

      // Should not throw error for valid unitId-only location
      await expect(service.import(
        mockEmissionsImport as EmissionsImportDTO,
        mockLocations as any,
        1,
        { userid: 'testUser' } as unknown as ImportIdentifiers, // identifiers
        '2023-01-01T00:00:00Z'
      )).resolves.not.toThrow();

      //To verify the location was found and assigned
      expect(dailyEmissionData[0]['locationId']).toBe('LOC1');
    });

    it('should find location with stackPipeId only', async () => {
      const dailyEmissionData = [
        { unitId: null, stackPipeId: 'CS1', parameterCode: 'CO2' }
      ];

      mockEmissionsImport.dailyEmissionData = dailyEmissionData;

      // Should not throw error for valid stackPipeId-only location
      await expect(service.import(
        mockEmissionsImport as EmissionsImportDTO,
        mockLocations as any,
      1,
        { userId: 'testUser' } as unknown as ImportIdentifiers, // identifiers
        '2023-01-01T00:00:00Z'
      )).resolves.not.toThrow();

      // Verify the location was found and assigned (TT6932 fix working)
      expect(dailyEmissionData[0]['locationId']).toBe('LOC2');
      });

    it('should find location with both unitId and stackPipeId', async () => {
      const dailyEmissionData = [
        { unitId: '4', stackPipeId: 'CS2', parameterCode: 'CO2' }
      ];

      mockEmissionsImport.dailyEmissionData = dailyEmissionData;

      // Should not throw error for valid both identifiers location
      await expect(service.import(
        mockEmissionsImport as EmissionsImportDTO,
        mockLocations as any,
        1,
        { userid: 'testUser' } as unknown as ImportIdentifiers, // identifiers
        '2023-01-01T00:00:00Z'
      )).resolves.not.toThrow();

      // Verify the location was found and assigned
      expect(dailyEmissionData[0]['locationId']).toBe('LOC3');
    });

    it('should throw error when no location found', async () => {
      const dailyEmissionData = [
        { unitId: 'NOMATCH', stackPipeId: null, parameterCode: 'CO2' }
      ];

      mockEmissionsImport.dailyEmissionData = dailyEmissionData;

      await expect(
        service.import(
          mockEmissionsImport as EmissionsImportDTO,
          mockLocations as any,
          1,
        { userid: 'testUser' } as unknown as ImportIdentifiers, // identifiers
        '2023-01-01T00:00:00Z'
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when multiple locations found', async () => {
      const ambiguousLocations = [
        { id: 'LOC1', unit: { name: '3' }, stackPipe: null },
        { id: 'LOC4', unit: { name: '3' }, stackPipe: null },
      ];

      const dailyEmissionData = [
        { unitId: '3', stackPipeId: null, parameterCode: 'CO2' }
      ];

      mockEmissionsImport.dailyEmissionData = dailyEmissionData;

      await expect(
        service.import(
          mockEmissionsImport as EmissionsImportDTO,
          ambiguousLocations as any,
          1,
        { userid: 'testUser' } as unknown as ImportIdentifiers, // identifiers
        '2023-01-01T00:00:00Z'
        )
      ).rejects.toThrow(BadRequestException);
    });
  });
});

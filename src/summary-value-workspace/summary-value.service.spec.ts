import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';

import { SummaryValueWorkspaceService } from './summary-value.service';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';
import { genSummaryValueImportDto } from '../../test/object-generators/summary-value-dto';
//import { mockRepositoryFunctions } from '../../test/mocks/mock-repository-functions';
import { genSummaryValue } from '../../test/object-generators/summary-value';
import { SummaryValue } from '../entities/workspace/summary-value.entity';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { ConfigService } from '@nestjs/config';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { SummaryValueImportDTO } from '../dto/summary-value.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

const writeObjectMock = jest.fn();

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  insert: jest.fn(),
  upsert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  export: jest.fn(),
};

describe('Summary Value Workspace Service Test', () => {
  let service: SummaryValueWorkspaceService;
  let bulkLoadService: BulkLoadService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SummaryValueWorkspaceService,
        SummaryValueMap,
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
          provide: SummaryValueWorkspaceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(SummaryValueWorkspaceService);
    repository = module.get(SummaryValueWorkspaceRepository);
    bulkLoadService = module.get(BulkLoadService);
    map = module.get(SummaryValueMap);

    // Reset and configure mocks for each test
    writeObjectMock.mockClear();
    repository.save.mockResolvedValue(null);
    repository.find.mockResolvedValue(genSummaryValue<SummaryValue>(1));
      repository.delete.mockResolvedValue({ affected: 1 });
      repository.export.mockResolvedValue([]);
  });

  describe('Summary Value Import', () => {
    it('should successfully import a summary value record', async () => {
      const generatedData = genSummaryValueImportDto(1);

      // @ts-expect-error use as mock
      jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
        writeObject: jest.fn(),
        complete: jest.fn(),
        finished: Promise.resolve(true),
      });

      const emissionsDto = new EmissionsImportDTO();
      emissionsDto.summaryValueData = generatedData;

      const locations = [{ unit: { name: 'a' }, id: 1 }];
      emissionsDto.summaryValueData[0].unitId = 'a';
      const identifiers = { locations: {}, userId: '' };
      const monitoringLocationId = faker.datatype.string();
      identifiers.locations[monitoringLocationId] = { components: {}, monitorFormulas: {}, monitoringSystems: {} };

      await expect(service.import(emissionsDto, locations, '', identifiers, ''))
        .resolves;
    });
  });

  describe('Summary Value Export', () => {
    it('should successfully export', async () => {
      const genSumValues = genSummaryValue<SummaryValue>(2);
      const promises = [];
      const params = new EmissionsParamsDTO();
      genSumValues.forEach(value => {
        promises.push(map.one(value));
      });
      const mappedSumValues = await Promise.all(promises);
      jest.spyOn(repository, 'export').mockResolvedValue(genSumValues);

      const r = await service.export(
        genSumValues.map(v => v.monitoringLocationId),
        params,
      );
      expect(r).toEqual(mappedSumValues);
      });
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
      dto.summaryValueData = [
        {
          unitId: '3',
          stackPipeId: null,
          parameterCode: 'NOX',
          currentReportingPeriodTotal: 100,
          ozoneSeasonToDateTotal: 200,
          yearToDateTotal: 300,
        } as SummaryValueImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid unitId-only location
      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should find location with stackPipeId only', async () => {
      const dto = new EmissionsImportDTO();
      dto.summaryValueData = [
        {
          unitId: null,
          stackPipeId: 'CS1',
          parameterCode: 'NOX',
          currentReportingPeriodTotal: 100,
          ozoneSeasonToDateTotal: 200,
          yearToDateTotal: 300,
        } as SummaryValueImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid stackPipeId-only location
      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should find location with both identifiers', async () => {
      const dto = new EmissionsImportDTO();
      dto.summaryValueData = [
        {
          unitId: '4',
          stackPipeId: 'CS2',
          parameterCode: 'NOX',
          currentReportingPeriodTotal: 100,
          ozoneSeasonToDateTotal: 200,
          yearToDateTotal: 300,
        } as SummaryValueImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      // Should not throw error for valid both identifiers location
      await expect(
        service.import(dto, mockLocations, 1, identifiers, new Date().toISOString())
      ).resolves.not.toThrow();
    });

    it('should throw error when no location found', async () => {
      const dto = new EmissionsImportDTO();
      dto.summaryValueData = [
        {
          unitId: '999',
          stackPipeId: null,
          parameterCode: 'NOX',
          currentReportingPeriodTotal: 100,
          ozoneSeasonToDateTotal: 200,
          yearToDateTotal: 300,
        } as SummaryValueImportDTO,
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
      dto.summaryValueData = [
        {
          unitId: '3',
          stackPipeId: null,
          parameterCode: 'NOX',
          currentReportingPeriodTotal: 100,
          ozoneSeasonToDateTotal: 200,
          yearToDateTotal: 300,
        } as SummaryValueImportDTO,
      ];

      const identifiers = { locations: {}, userId: 'test-user' };

      await expect(
        service.import(dto, ambiguousLocations, 1, identifiers, new Date().toISOString())
      ).rejects.toThrow(BadRequestException);
    });
  });
});

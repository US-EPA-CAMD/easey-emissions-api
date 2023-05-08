import { Test } from '@nestjs/testing';
import {
  SummaryValueWorkspaceService,
} from './summary-value.service';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';
import { genSummaryValueImportDto } from '../../test/object-generators/summary-value-dto';
import { mockRepositoryFunctions } from '../../test/mocks/mock-repository-functions';
import { genSummaryValue } from '../../test/object-generators/summary-value';
import { SummaryValue } from '../entities/workspace/summary-value.entity';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { ConfigService } from '@nestjs/config';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

const mockRepository = {
  ...mockRepositoryFunctions,
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
        BulkLoadService,
        ConfigService,
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

    repository.save.mockResolvedValue(null);
    repository.find.mockResolvedValue(genSummaryValue<SummaryValue>(1));
  });

  describe('Summary Value Import', () => {
    it('should successfully import a summary value record', async () => {

      const generatedData = genSummaryValueImportDto(1);

      // @ts-expect-error use as mock
      jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
        writeObject:jest.fn(),
        complete:jest.fn(),
        finished: Promise.resolve(true)
      });

      const emissionsDto = new EmissionsImportDTO();
      emissionsDto.summaryValueData = generatedData;

      const locations = [{ unit: { name: "a" }, id: 1 }]
      emissionsDto.summaryValueData[0].unitId = "a";
      const identifiers = {
        components: [],
        monitorFormulas: [],
        monitoringSystems: [],
        userId: "",
      } as unknown as ImportIdentifiers;

      await expect(service.import(emissionsDto, locations, "", identifiers, "")).resolves;
      
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
});

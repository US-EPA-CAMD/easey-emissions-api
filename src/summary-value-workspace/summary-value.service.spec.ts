import { Test } from '@nestjs/testing';
import {
  SummaryValueCreate,
  SummaryValueWorkspaceService,
} from './summary-value.service';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';
import { genSummaryValueImportDto } from '../../test/object-generators/summary-value-import-dto';
import { faker } from '@faker-js/faker';
import { mockRepositoryFunctions } from '../../test/mocks/mock-repository-functions';
import { genSummaryValue } from '../../test/object-generators/summary-value';
import { SummaryValue } from '../entities/workspace/summary-value.entity';

const mockMap = {
  many: () => [],
  one: () => null,
};


describe('Summary Value Workspace Service Test', () => {
  let service: SummaryValueWorkspaceService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SummaryValueWorkspaceService,
        {
          provide: SummaryValueMap,
          useValue: mockMap,
        },
        {
          provide: SummaryValueWorkspaceRepository,
          useValue: mockRepositoryFunctions,
        },
      ],
    }).compile();

    service = module.get(SummaryValueWorkspaceService);
    repository = module.get(SummaryValueWorkspaceRepository);
    map = module.get(SummaryValueMap);

    repository.save.mockResolvedValue(null)
    repository.find.mockResolvedValue(genSummaryValue(1))
  });

  describe('Summary Value Import', () => {
    
    it('should successfully import a summary value record', async () => {
      const generatedData = genSummaryValueImportDto(1)[0];
      const importData: SummaryValueCreate = {
        ...generatedData,
        monitoringLocationId: faker.datatype.string(5),
        reportingPeriodId: faker.datatype.number(),
      };

      const r = await service.import(importData);
      expect(r).toBeNull();
    });
  });

  describe('Summary Value Export', async () =>{

    const genSumValues = genSummaryValue<SummaryValue>(2);
    const promises = [];
    genSumValues.forEach(value => {
      promises.push(map.one(value));
    });
    const mappedSumValues = await Promise.all(promises);
    const r = await service.export();
  })
});

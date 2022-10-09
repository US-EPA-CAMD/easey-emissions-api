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
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { util } from 'prettier';

const mockRepository = {
  ...mockRepositoryFunctions,
  export: jest.fn(),
}

describe('Summary Value Workspace Service Test', () => {
  let service: SummaryValueWorkspaceService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SummaryValueWorkspaceService,
        SummaryValueMap,
        {
          provide: SummaryValueWorkspaceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(SummaryValueWorkspaceService);
    repository = module.get(SummaryValueWorkspaceRepository);
    map = module.get(SummaryValueMap);

    repository.save.mockResolvedValue(null)
    repository.find.mockResolvedValue(genSummaryValue<SummaryValue>(1))
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

  describe('Summary Value Export', () =>{

    it( 'should successfully export', async ()=>{
      const genSumValues = genSummaryValue<SummaryValue>(2);
      const promises = [];
      const params = new EmissionsParamsDTO();
      genSumValues.forEach(value => {
        promises.push(map.one(value));
      });
      const mappedSumValues = await Promise.all(promises);
      jest.spyOn(repository, 'export').mockResolvedValue(genSumValues);
  
      const r = await service.export(genSumValues.map(v=>v.monitoringLocationId), params);
      expect(r).toEqual(mappedSumValues)  
    })
  })
});

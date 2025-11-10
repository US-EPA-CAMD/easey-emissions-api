import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { SummaryValueService } from './summary-value.service';
import { SummaryValueMap } from '../maps/summary-value.map';
import { mockRepositoryFunctions } from '../../test/mocks/mock-repository-functions';
import { genSummaryValue } from '../../test/object-generators/summary-value';
import { SummaryValue } from '../entities/workspace/summary-value.entity';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

const mockRepository = {
  ...mockRepositoryFunctions,
  export: jest.fn(),
};

jest.mock('./summary-value.repository', () => ({
  SummaryValueRepository: jest.fn().mockImplementation(() => mockRepository),
}));

describe('Summary Value Workspace Service Test', () => {
  let service: SummaryValueService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SummaryValueService,
        SummaryValueMap,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              isReleased: false,
            }),
          },
        }
      ],
    }).compile();

    service = module.get(SummaryValueService);
    repository = mockRepository;
    map = module.get(SummaryValueMap);

    repository.find.mockResolvedValue(genSummaryValue<SummaryValue>(1));
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

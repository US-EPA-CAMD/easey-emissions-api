import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import {
  SummaryValueCreate,
  SummaryValueWorkspaceService,
} from './summary-value.service';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';
import { genSummaryValueImportDto } from '../../test/object-generators/summary-value-import-dto';

const mockRepository = {
  create: () => null,
  save: () => null,
  find: () => null,
};

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
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(SummaryValueWorkspaceService);
    repository = module.get(SummaryValueWorkspaceRepository);
    map = module.get(SummaryValueMap);
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
});

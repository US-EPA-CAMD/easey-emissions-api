import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { BaseEntity, EntityManager } from 'typeorm';
import * as typeorm_functions from 'typeorm/globals';

import { genEmissionsImportDto } from '../../test/object-generators/emissions-dto';
import { CodeChecksService } from './code-checks.service';

describe('Code Checks Service Tests', () => {
  let service: CodeChecksService;
  let manager: EntityManager;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [CodeChecksService, EntityManager],
    }).compile();

    service = module.get(CodeChecksService);
    manager = module.get(EntityManager);
  });

  it('tests runChecks()', async () => {
    jest.spyOn(BaseEntity, 'getRepository').mockImplementation(
      jest.fn().mockReturnValue({
        metadata: {
          tableName: 'table',
          primaryColumns: [{ databaseName: 'primaryCol' }],
        },
      }),
    );

    jest
      .spyOn(manager, 'query')
      .mockResolvedValue([{ column1: ['invalidCode'] }]);

    const mockedPayload = genEmissionsImportDto(1, {
      include: [
        'weeklyTestSummaryData',
        'dailyTestSummaryData',
        'hourlyOperatingData',
      ],
    });

    const results = await service.runChecks(mockedPayload[0]);
    expect(results.length).toBe(6);
  });
});

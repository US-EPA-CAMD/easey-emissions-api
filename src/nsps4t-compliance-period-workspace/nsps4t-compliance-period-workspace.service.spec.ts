import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager, QueryRunner } from 'typeorm';

import { genNsps4tCompliancePeriod } from '../../test/object-generators/nsps4t-compliance-period';
import { Nsps4tCompliancePeriod } from '../entities/workspace/nsps4t-compliance-period.entity';
import { Nsps4tAnnualMap } from '../maps/nsps4t-annual.map';
import { Nsps4tCompliancePeriodWorkspaceRepository } from './nsps4t-compliance-period-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceService } from './nsps4t-compliance-period-workspace.service';

describe('Nsps4tCompliancePeriodWorkspaceService', () => {
  let service: Nsps4tCompliancePeriodWorkspaceService;
  let map: any;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
        Nsps4tCompliancePeriodWorkspaceService,
        Nsps4tCompliancePeriodWorkspaceRepository,
        BulkLoadService,
        ConfigService,
        Nsps4tAnnualMap,
      ],
    }).compile();

    service = module.get<Nsps4tCompliancePeriodWorkspaceService>(
      Nsps4tCompliancePeriodWorkspaceService,
    );
    map = module.get(Nsps4tAnnualMap);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully import', async () => {
    const nsps4tCompliancePeriod = genNsps4tCompliancePeriod<
      Nsps4tCompliancePeriod
    >(1);

    jest.spyOn(bulkLoadService, 'startBulkLoader').mockImplementation(
        (_tableLocation: string, _columns?: string[], _delimiter?: string, _queryRunner?: QueryRunner) => {
          // @ts-ignore
          return Promise.resolve({
            writeObject: jest.fn(),
            complete: jest.fn(),
            finished: Promise.resolve(true),
            status: 'Complete',
          });
        }
    );

    await expect(service.import(nsps4tCompliancePeriod)).resolves;
  });
});

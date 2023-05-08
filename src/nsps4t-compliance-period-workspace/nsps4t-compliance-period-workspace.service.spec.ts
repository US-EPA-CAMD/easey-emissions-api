import { Test, TestingModule } from '@nestjs/testing';
import { Nsps4tCompliancePeriodWorkspaceService } from './nsps4t-compliance-period-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceRepository } from './nsps4t-compliance-period-workspace.repository';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { ConfigService } from '@nestjs/config';
import { Nsps4tAnnualMap } from '../maps/nsps4t-annual.map';
import { genNsps4tCompliancePeriod } from '../../test/object-generators/nsps4t-compliance-period';
import { Nsps4tCompliancePeriod } from '../entities/workspace/nsps4t-compliance-period.entity';

describe('Nsps4tCompliancePeriodWorkspaceService', () => {
  let service: Nsps4tCompliancePeriodWorkspaceService;
  let map;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    //@ts-expect-error as mock
    jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
      writeObject: jest.fn(),
      complete: jest.fn(),
      finished: Promise.resolve(true),
    });

    await expect(service.import(nsps4tCompliancePeriod)).resolves;
  });
});

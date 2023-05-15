import { Test } from '@nestjs/testing';
import { MonitorPlanChecksService } from './monitor-plan-checks.service';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceRepository } from './monitor-plan-repository';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { genMonitorPlan } from '../../test/object-generators/monitor-plan';

describe('MonitorPlanChecksService tests', () => {
  let service: MonitorPlanChecksService;
  let repository: any;

  const mockRepository = {
    getMonitorPlansByLocationIds: jest.fn(),
  };

  const unitStackLocations: LocationIdentifiers[] = [
    {
      unitId: '1',
      locationId: '1',
      stackPipeId: null,
      componentIds: new Set(['1', '2']),
      monitoringSystemIds: new Set(['3', '4']),
      ltffMonitoringSystemIds: new Set(['5', '6']),
    },
  ];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorPlanChecksService,
        {
          provide: MonitorPlanWorkspaceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MonitorPlanChecksService);
    repository = module.get(MonitorPlanWorkspaceRepository);
  });

  describe('runChecks() test', () => {
    beforeAll(() => {
      CheckCatalogService.formatResultMessage = () => '';
    });

    it('should return a non empty array', async () => {
      repository.getMonitorPlansByLocationIds.mockResolvedValue(
        genMonitorPlan(1, { include: ['locations'], monitorLocationAmount: 1 }),
      );
      const errorList = await service.runChecks(unitStackLocations);
      expect(errorList.length).toBeGreaterThan(0);
    });
  });
});

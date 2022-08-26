import { Test, TestingModule } from '@nestjs/testing';
import { HourlyOperatingDataWorkspaceService } from './hourly-operating-data-workspace.service';
import { HourlyOperatingDataWorkspaceRepository } from './hourly-operating-data-workspace.repository';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.repository';

describe('HourlyOperatingDataWorkspaceService', () => {
  let service: HourlyOperatingDataWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueWorkspaceService,
        HourlyOperatingDataWorkspaceService,
        {
          provide: DerivedHourlyValueWorkspaceRepository,
          useValue: () => jest,
        },
        {
          provide: HourlyOperatingDataWorkspaceRepository,
          useValue: () => jest,
        },
      ],
    }).compile();

    service = module.get<HourlyOperatingDataWorkspaceService>(
      HourlyOperatingDataWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

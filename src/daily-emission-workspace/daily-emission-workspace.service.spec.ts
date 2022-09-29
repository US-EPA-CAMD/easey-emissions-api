import { Test, TestingModule } from '@nestjs/testing';
import { DailyEmissionWorkspaceService } from './daily-emission-workspace.service';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';

describe('DailyEmissionWorkspaceService', () => {
  let service: DailyEmissionWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyEmissionWorkspaceService,
        DailyEmissionWorkspaceRepository,
        DailyFuelWorkspaceService,
        DailyFuelWorkspaceRepository,
      ],
    }).compile();

    service = module.get<DailyEmissionWorkspaceService>(
      DailyEmissionWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

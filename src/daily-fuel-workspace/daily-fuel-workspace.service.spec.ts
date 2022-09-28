import { Test, TestingModule } from '@nestjs/testing';
import { DailyFuelWorkspaceService } from './daily-fuel-workspace.service';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';

describe('DailyFuelWorkspaceService', () => {
  let service: DailyFuelWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyFuelWorkspaceService, DailyFuelWorkspaceRepository],
    }).compile();

    service = module.get<DailyFuelWorkspaceService>(DailyFuelWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

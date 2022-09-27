import { Test, TestingModule } from '@nestjs/testing';
import { DailyFuelWorkspaceService } from './daily-fuel-workspace.service';

describe('DailyFuelWorkspaceService', () => {
  let service: DailyFuelWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyFuelWorkspaceService],
    }).compile();

    service = module.get<DailyFuelWorkspaceService>(DailyFuelWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DailyEmissionWorkspaceService } from './daily-emission-workspace.service';

describe('DailyEmissionWorkspaceService', () => {
  let service: DailyEmissionWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyEmissionWorkspaceService],
    }).compile();

    service = module.get<DailyEmissionWorkspaceService>(
      DailyEmissionWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

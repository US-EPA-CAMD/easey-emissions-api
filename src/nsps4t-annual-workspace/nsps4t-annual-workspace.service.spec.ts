import { Test, TestingModule } from '@nestjs/testing';
import { Nsps4tAnnualWorkspaceService } from './nsps4t-annual-workspace.service';
import { Nsps4tAnnualWorkspaceRepository } from './nsps4t-annual-workspace.repository';

describe('Nsps4tAnnualWorkspaceService', () => {
  let service: Nsps4tAnnualWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Nsps4tAnnualWorkspaceService,
        Nsps4tAnnualWorkspaceRepository,
      ],
    }).compile();

    service = module.get<Nsps4tAnnualWorkspaceService>(
      Nsps4tAnnualWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

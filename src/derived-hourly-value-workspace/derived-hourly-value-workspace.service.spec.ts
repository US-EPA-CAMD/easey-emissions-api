import { Test, TestingModule } from '@nestjs/testing';
import { DerivedHourlyValueWorkspaceService } from './derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';

describe('DerivedHourlyValueWorkspaceService', () => {
  let service: DerivedHourlyValueWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueWorkspaceService,
        {
          provide: DerivedHourlyValueWorkspaceRepository,
          useValue: () => jest,
        },
      ],
    }).compile();

    service = module.get<DerivedHourlyValueWorkspaceService>(
      DerivedHourlyValueWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

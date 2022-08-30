import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmissionsService } from './emissions.service';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';

describe('Emissions Service', () => {
  let emissionsService: EmissionsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmissionsService,
        EmissionsSubmissionsProgressMap,
        EmissionsSubmissionsProgressRepository,
        ConfigService,
      ],
    }).compile();

    emissionsService = module.get(EmissionsService);
  });

  it('should have a emissions service', function() {
    expect(emissionsService).toBeDefined();
  });
});
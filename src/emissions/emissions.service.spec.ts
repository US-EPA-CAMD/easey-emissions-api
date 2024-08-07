import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { EmissionsService } from './emissions.service';

describe('Emissions Service', () => {
  let emissionsService: EmissionsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
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


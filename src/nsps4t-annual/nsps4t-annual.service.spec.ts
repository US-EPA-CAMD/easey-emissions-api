import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { Nsps4tAnnualRepository } from './nsps4t-annual.repository';
import { Nsps4tAnnualService } from './nsps4t-annual.service';

describe('Nsps4tAnnualService', () => {
  let service: Nsps4tAnnualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManager, Nsps4tAnnualRepository, Nsps4tAnnualService],
    }).compile();

    service = module.get<Nsps4tAnnualService>(Nsps4tAnnualService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

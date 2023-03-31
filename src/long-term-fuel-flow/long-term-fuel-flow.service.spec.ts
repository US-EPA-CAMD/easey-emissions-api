import { Test } from '@nestjs/testing';
import { mockLongTermFuelFlowRepository } from '../../test/mocks/mock-long-term-fuel-flow-repository';
import { LongTermFuelFlowRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowService } from './long-term-fuel-flow.service';

describe('--LongTermFuelFlowService--', () => {
  let repository: LongTermFuelFlowRepository;
  let service: LongTermFuelFlowService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LongTermFuelFlowService,
        {
          provide: LongTermFuelFlowRepository,
          useValue: mockLongTermFuelFlowRepository,
        },
      ],
    }).compile();

    repository = module.get(LongTermFuelFlowRepository);
    service = module.get(LongTermFuelFlowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

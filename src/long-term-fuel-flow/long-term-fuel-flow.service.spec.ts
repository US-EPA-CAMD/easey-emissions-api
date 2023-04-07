import { Test } from '@nestjs/testing';
import { mockLongTermFuelFlowRepository } from '../../test/mocks/mock-long-term-fuel-flow-repository';
import { LongTermFuelFlowRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowService } from './long-term-fuel-flow.service';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { genLongTermFuelFlow } from '../../test/object-generators/long-term-fuel-flow';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { LongTermFuelFlow } from '../entities/long-term-fuel-flow.entity';

describe('--LongTermFuelFlowService--', () => {
  let repository: LongTermFuelFlowRepository;
  let service: LongTermFuelFlowService;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LongTermFuelFlowService,
        LongTermFuelFlowMap,
        {
          provide: LongTermFuelFlowRepository,
          useValue: mockLongTermFuelFlowRepository,
        },
      ],
    }).compile();

    repository = module.get(LongTermFuelFlowRepository);
    service = module.get(LongTermFuelFlowService);
    map = module.get(LongTermFuelFlowMap);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should get long term fuel flow by location ids', async function() {
    const genLongTermFuelFlowValues = genLongTermFuelFlow<LongTermFuelFlow>(1);
    const promises = [];
    genLongTermFuelFlowValues.forEach(value => {
      promises.push(map.one(value));
    });
    const mappedValues = await Promise.all(promises);
    const params = new EmissionsParamsDTO();

    jest
      .spyOn(repository, 'export')
      .mockResolvedValue(genLongTermFuelFlowValues as LongTermFuelFlow[]);

    const result = await service.export(
      genLongTermFuelFlowValues.map(value => value.monitoringLocationId),
      params,
    );
    expect(result).toEqual(mappedValues);
  });
});

import { Test } from '@nestjs/testing';
import { mockLongTermFuelFlowWorkspaceRepository } from '../../test/mocks/mock-long-term-fuel-flow-workspace-repository';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from './long-term-fuel-flow.service';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { genLongTermFuelFlow } from '../../test/object-generators/long-term-fuel-flow';
import { LongTermFuelFlow } from '../entities/workspace/long-term-fuel-flow.entity';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

describe('--LongTermFuelFlowWorkspaceService--', () => {
  let repository: LongTermFuelFlowWorkspaceRepository;
  let service: LongTermFuelFlowWorkspaceService;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LongTermFuelFlowWorkspaceService,
        LongTermFuelFlowMap,
        {
          provide: LongTermFuelFlowWorkspaceRepository,
          useValue: mockLongTermFuelFlowWorkspaceRepository,
        },
      ],
    }).compile();

    repository = module.get(LongTermFuelFlowWorkspaceRepository);
    service = module.get(LongTermFuelFlowWorkspaceService);
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

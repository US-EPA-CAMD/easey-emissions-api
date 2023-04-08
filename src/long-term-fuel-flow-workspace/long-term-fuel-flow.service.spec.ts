import { Test } from '@nestjs/testing';
import { mockLongTermFuelFlowWorkspaceRepository } from '../../test/mocks/mock-long-term-fuel-flow-workspace-repository';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from './long-term-fuel-flow.service';
import { LongTermFuelFlow } from '../entities/workspace/long-term-fuel-flow.entity';
import { LongTermFuelFlowImportDTO } from '../dto/long-term-fuel-flow.dto';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { genLongTermFuelFlow } from '../../test/object-generators/long-term-fuel-flow';
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

  it('should successfully import', async ()=>{
    const mock = new LongTermFuelFlow();
    mock.id = "123";
    const params = 
    {
      ...new LongTermFuelFlowImportDTO(),
      reportingPeriodId: 1,
      monitoringLocationId:"",
      identifiers:null
    }

    jest.spyOn(repository, 'create').mockReturnValue(mock);
    jest.spyOn(repository, 'save').mockResolvedValue(mock);

    const result = await service.import(params);

    expect(result.id).toBe("123")
  })
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

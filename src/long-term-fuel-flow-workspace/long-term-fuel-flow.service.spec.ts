import { Test } from '@nestjs/testing';
import { mockLongTermFuelFlowWorkspaceRepository } from '../../test/mocks/mock-long-term-fuel-flow-workspace-repository';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from './long-term-fuel-flow.service';
import { LongTermFuelFlow } from '../entities/workspace/long-term-fuel-flow.entity';
import { LongTermFuelFlowImportDTO } from '../dto/long-term-fuel-flow.dto';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';

describe('--LongTermFuelFlowWorkspaceService--', () => {
  let repository: LongTermFuelFlowWorkspaceRepository;
  let service: LongTermFuelFlowWorkspaceService;

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
});

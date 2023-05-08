import { Test } from '@nestjs/testing';
import { mockLongTermFuelFlowWorkspaceRepository } from '../../test/mocks/mock-long-term-fuel-flow-workspace-repository';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from './long-term-fuel-flow.service';
import { LongTermFuelFlow } from '../entities/workspace/long-term-fuel-flow.entity';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { genLongTermFuelFlow } from '../../test/object-generators/long-term-fuel-flow';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { ConfigService } from '@nestjs/config';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

describe('--LongTermFuelFlowWorkspaceService--', () => {
  let repository: LongTermFuelFlowWorkspaceRepository;
  let service: LongTermFuelFlowWorkspaceService;
  let bulkLoadService: BulkLoadService;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LongTermFuelFlowWorkspaceService,
        LongTermFuelFlowMap,
        BulkLoadService,
        ConfigService,
        {
          provide: LongTermFuelFlowWorkspaceRepository,
          useValue: mockLongTermFuelFlowWorkspaceRepository,
        },
      ],
    }).compile();

    repository = module.get(LongTermFuelFlowWorkspaceRepository);
    service = module.get(LongTermFuelFlowWorkspaceService);
    map = module.get(LongTermFuelFlowMap);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should successfully import', async () => {
    const mockedData = genLongTermFuelFlow<LongTermFuelFlow>(1);
    const longTermFuelFlow = await map.many(mockedData);

    //@ts-expect-error as mock
    jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
      writeObject: jest.fn(),
      complete: jest.fn(),
      finished: Promise.resolve(true),
    });

    const emissionsDto = new EmissionsImportDTO();
    emissionsDto.longTermFuelFlowData = longTermFuelFlow;

    const locations = [{ unit: { name: '1' }, id: 1 }];

    longTermFuelFlow[0].unitId = '1';
    const identifiers = ({
      components: [],
      monitorFormulas: [],
      monitoringSystems: [],
      userId: '',
    } as unknown) as ImportIdentifiers;

    await expect(
      service.import(emissionsDto, locations, '1', identifiers, '2019-01-01'),
    ).resolves;
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
